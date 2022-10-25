import { Injectable } from '@angular/core';
import { TipoNotificaSound } from '../../../shared/enum/tipo-notifica-sound';

const NUOVA_PARTENZA_DISTACCAMENTO_NOTIFICATION_URL = '../assets/sounds/notification.wav';
const SIMPLE_NOTIFICATION_URL = '../assets/sounds/notification.wav';

@Injectable({
    providedIn: 'root'
})

export class SoundAlertService {

    audio: HTMLAudioElement;

    startSound(type?: TipoNotificaSound): void {
        let audioSrc: string;
        switch (type) {
            case TipoNotificaSound.NuovaPartenzaDistaccamento:
                audioSrc = NUOVA_PARTENZA_DISTACCAMENTO_NOTIFICATION_URL;
                break;
            default:
                audioSrc = SIMPLE_NOTIFICATION_URL;
                break;
        }
        this.audio = new Audio();
        this.audio.src = audioSrc;
        this.audio.load();
        this.audio.play().then(() => {
            console.log('File audio (' + audioSrc + ') riprodotto con successo.');
        });
    }
}
