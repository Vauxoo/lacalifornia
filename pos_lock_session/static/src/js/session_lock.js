odoo.define('pos_lock_session.session_lock', function (require) {
"use strict";

var core = require('web.core');
var chrome = require('point_of_sale.chrome');
var gui = require('point_of_sale.gui');
var PopupWidget = require('point_of_sale.popups');
var screens = require('point_of_sale.screens');

var _t = core._t;

screens.PaymentScreenWidget.include({
        finalize_validation: function() {
            this._super();
            this.gui.show_screen('login',{lock:true});
    }
});

var SessionLock = PopupWidget.extend({
    template:'SessionLock',
    events: _.extend({}, PopupWidget.prototype.events,{
        "click .screen_lock" : "unlock_screen",
    }),
    show: function(options){
        var self = this;
        this._super(options);
        $(document).keydown(function(e) {
            if(e.keyCode == 13) {
                e.preventDefault();
                self.gui.show_screen('login',{lock:true});
            }
        });
    },
    unlock_screen:function(){
        var self = this;
        this.gui.show_screen('login',{lock:true});
    }
});
gui.define_popup({name:'lock', widget: SessionLock});
/*
var CashierPasswordWidget = PopupWidget.extend({
    template: 'CashierPaswordWidget',
    show: function(options){
        options = options || {};
        this._super(options);

        this.inputbuffer = '' + (options.value   || '');
        this.renderElement();
        this.firstinput = true;
    },
    click_numpad: function(event) {
        var newbuf = this.gui.numpad_input(
            this.inputbuffer,
            $(event.target).data('action'),
            {'firstinput': this.firstinput});

        this.firstinput = (newbuf.length === 0);

        if (newbuf !== this.inputbuffer) {
            this.inputbuffer = newbuf;
            this.$('.value').text(this.inputbuffer);
        }
    }
});
gui.define_popup({name:'cashier_password', widget: CashierPaswordWidget});

var PasswordPopupWidget = NumberPopupWidget.extend({
    renderElement: function(){
        this._super();
    },
    click_numpad: function(event){
        this._super.apply(this, arguments);
        var $value = this.$('.value');
        $value.text($value.text().replace(/./g, '•'));
    },
});
gui.define_popup({name:'password', widget: PasswordPopupWidget});
*/
chrome.Chrome.include({
    events: {
            "click .pos-lock": "on_click_pos_lock",
        },

    init: function() {
        var self = this;
        this._super();
        $(document).keydown(function(e) {
            if(self.pos.config.pos_lock) {
                if(e.keyCode == 76 && e.ctrlKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    var cashier = self.pos.get_cashier().id;
                    for (var i = 0; i < self.pos.users.length; i++) {
                        var user = self.pos.users[i];
                        if (user.id === cashier) {
                            var cashier_pswd = user.pos_security_pin;
                        }
                    }
                    if(!cashier_pswd){
                        self.gui.show_popup('error', {
                            'title': _t('Security pin is not set'),
                            'body':  _t('Please set a security pin.'),
                        });
                    }
                    else{
                        self.gui.show_popup('lock',{});
                    }
                }
            }
        });
    },
    renderElement: function() {
        var self = this;
        return this._super();
    },

    build_widgets: function() {
        this._super();
        var cashier = this.pos.get_cashier().id;
        for (var i = 0; i < this.pos.users.length; i++) {
            var user = this.pos.users[i];
            if (user.id === cashier) {
                var cashier_pswd = user.pos_security_pin;
            }
        }
        if (this.pos.config.pos_lock && cashier_pswd) {
            this.gui.set_startup_screen('login');
        }
    },
    on_click_pos_lock: function (e) {
        var self = this;
        e.stopPropagation();
        var cashier = this.pos.get_cashier().id;
        for (var i = 0; i < this.pos.users.length; i++) {
            var user = this.pos.users[i];
            if (user.id === cashier) {
                var cashier_pswd = user.pos_security_pin;
            }
        }
        if(!cashier_pswd){
            this.gui.show_popup('error', {
                'title': _t('Security pin is not set'),
                'body':  _t('Please set a security pin.'),
            });
        }
        else{
            self.gui.show_popup('lock',{});
        }
    },

});

});