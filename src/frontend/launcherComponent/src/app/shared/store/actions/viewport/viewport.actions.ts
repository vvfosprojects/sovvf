export class SetAvailHeight {
    static readonly type = '[Viewport] Set Window Available Height';

    constructor(public availHeight: any) {
    }
}

export class SetContentHeight {
    static readonly type = '[Viewport] Set Content Height';

    constructor(public contentHeight: number) {
    }
}

export class SetInnerWidth {
    static readonly type = '[Viewport] Set Inner Width';

    constructor(public innerWidth: number) {
    }
}

export class SunMode {
  static readonly type = '[SunMode] Sun Mode visualizzazione';

  constructor(public sunMode?: boolean) {
  }
}
