
const Clutter = imports.gi.Clutter;
const Lang = imports.lang;
const St = imports.gi.St;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const NixChannels = Me.imports.nixChannels;

let _indicator;

const NixChannelMenuItem = new Lang.Class({
    Name: 'NixChannelMenuItem',
    Extends: PopupMenu.PopupBaseMenuItem,

    _init: function(info) {
        this.parent();
        this._info = info;


        this._label = new St.Label({ text: info.name + ' -- ' + info.age });
        this.actor.add_child(this._label);

        this._changedId = info.connect('changed',
                                       Lang.bind(this, this._propertiesChanged));
    },

    destroy: function() {
        if (this._changedId) {
            this._info.disconnect(this._changedId);
            this._changedId = 0;
        }

        this.parent();
    },

    activate: function(event) {
        this._info.launch(event.get_time());

        this.parent(event);
    },

    _propertiesChanged: function(info) {
        this._icon.gicon = info.icon;
        this._label.text = info.name;
    },
});

const NixChannelMenu = new Lang.Class({
    Name: 'NixChannelMenu.NixChannelMenu',
    Extends: PanelMenu.Button,

    _init: function () {
        this.parent(0.0, 'Nix Channel Age');

        // Create button to show in toolbar
        let hbox = new St.BoxLayout({ style_class: 'panel-status-menu-box' });

        // Create label for button
        let label = new St.Label({ text: 'Nix Channel Age',
                                   y_expand: true,
                                   y_align: Clutter.ActorAlign.CENTER });

        // Add label and arrow to button
        hbox.add_child(label);
        hbox.add_child(PopupMenu.arrowIcon(St.Side.BOTTOM));

        // Makes sure to add the menu to the bar
        this.actor.add_actor(hbox);

        // Helper class to populate data
        this.channelsManager = new NixChannels.ChannelsManager();

        // Create a section in the menu
        this._channels = new PopupMenu.PopupMenuSection();

        // Create menu items
        this._redisplay();

        // Add items to menu
        this.menu.addMenuItem(this._channels);
    },

    /**
     * Destroy the instance of this class and it's dependencies
     */
    destroy: function () {
        this.channelsManager.destroy();
        this.parent();
    },

    /**
     * Remove all channel data and run the create function again
     */
    _redisplay: function () {
        this._channels.removeAll();
        this._create();
    },

    /**
     * Create menu entries for all channels that our channel manager returned
     */
    _create: function () {
        // Get channels
        let channels = this.channelsManager.get();

        // Loop channels and create menu entries
        for (let i = 0; i < channels.length; i++) {
            this._channels.addMenuItem(new NixChannelMenuItem(channels[i]));
        }
    }
});

function init() {
    _indicator = new NixChannelMenu();
}

function enable() {
    let position = 1;
    let align = 'right';

    Main.panel.addToStatusArea('nix-channel-age', _indicator, position, align);
}

function disable() {
    _indicator.destroy();
}
