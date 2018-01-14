
const Lang = imports.lang;
const Signals = imports.signals;

const ChannelInfo = new Lang.Class({
    Name: 'ChannelInfo',

    _init: function (name, age) {
        this.name = name;
        this.age = age;
    },
});

Signals.addSignalMethods(ChannelInfo.prototype);

var ChannelsManager = new Lang.Class({
    Name: 'ChannelsManager',

    _init: function () {
        this._channels = [
            new ChannelInfo('my channel name', '4days'),
            new ChannelInfo('my fast channel name', '1days'),
        ];
    },

    get: function () {
        return this._channels;
    }
});

Signals.addSignalMethods(ChannelsManager.prototype);
