
const Lang = imports.lang;
const Signals = imports.signals;
const Mainloop = imports.mainloop;
const Soup = imports.gi.Soup; // HTTP Library

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
        this._channels = [];

        this._apiUrl = 'https://howoldis.herokuapp.com/api/channels';

        this._refreshData();
    },

    /**
     * Method to have a loop that fetches data from the internet and puts it in
     * the list of data so we can serve it to the UI.
     */
    _refreshData: function () {
        // Load data from the internet
        this._loadData();

        // Stop the timer
        this._removeTimeout();

        // Create a new timer
        this._timeout = Mainloop.timeout_add_seconds(
            1800,
            Lang.bind(this, this._refreshData)
        );

        return true;
    },
    _removeTimeout: function () {
        if (this._timeout) {
            Mainloop.source_remove(this._timeout);
            this._timeout = null;
        }
    },

    _loadData: function () {
        // New HTTP session
        let httpSession = new Soup.Session();

        // New request
        let req = Soup.form_request_new_from_hash('GET', this._apiUrl, []);

        // Execute the http request and create callback
        httpSession.queue_message(req, Lang.bind(this, function (httpSession, result) {
            if (result.status_code !== 200) {
                return;
            }

            let json = JSON.parse(result.response_body.data);

            // Send data back to a method to update the UI
            this._updateData(json);
        }));
    },

    _updateData: function (data) {
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
