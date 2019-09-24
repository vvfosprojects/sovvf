import { Injectable, NgZone } from '@angular/core';
import { RpcStoreService } from './rpc-store.service';
import { Subscription } from 'rxjs';

declare global {
    interface Window {
        RTCPeerConnection: RTCPeerConnection;
        mozRTCPeerConnection: RTCPeerConnection;
        webkitRTCPeerConnection: RTCPeerConnection;
    }
}

@Injectable()
export class RpcConnectionService {

    private rcpStatus;
    private subscription = new Subscription();
    private ipRegex = new RegExp(patternString);

    constructor(private zone: NgZone, private rpcStore: RpcStoreService) {
        this.determineLocalIp();
        this.subscription.add(this.rpcStore.getRcpStatus().subscribe(result => this.rcpStatus = result));
    }

    private static getRTCPeerConnection() {
        return window.RTCPeerConnection ||
            window.mozRTCPeerConnection ||
            window.webkitRTCPeerConnection;
    }

    initializeRpc(): Promise<any> {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (this.rcpStatus) {
                    resolve();
                    clearInterval(interval);
                }
            }, 100);
        });
    }

    private determineLocalIp() {
        window.RTCPeerConnection = RpcConnectionService.getRTCPeerConnection();

        const pc = new RTCPeerConnection({ iceServers: [] });
        pc.createDataChannel('');
        pc.createOffer().then(pc.setLocalDescription.bind(pc));

        pc.onicecandidate = (ice) => {
            this.zone.run(() => {
                if (!ice || !ice.candidate || !ice.candidate.candidate) {
                    return;
                }

                const candidate = this.ipRegex.exec(ice.candidate.candidate);
                let localIp: string;
                if (candidate && candidate.length > 0) {
                    localIp = candidate[1];
                } else if (ice.candidate && ice.candidate['address']) {
                    localIp = ice.candidate['address'];
                } else {
                    localIp = 'local address n/d';
                }
                this.rpcStore.setLocalIp(localIp);

                pc.onicecandidate = () => {
                };
                pc.close();
            });
        };
    }

}

// tslint:disable-next-line:max-line-length
export const patternString = '/([0-9]{1,3}(\\.[0-9]{1,3}){3}|(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])))($|\\s)/';
