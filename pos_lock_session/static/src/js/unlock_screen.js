odoo.define('pos_lock_session.screen', function (require) {
    "use strict";

    var screens = require('point_of_sale.screens');
    var gui = require('point_of_sale.gui');
    var models = require('point_of_sale.models');
    var _super_posmodel = models.PosModel.prototype;
    var DB = require('point_of_sale.DB');

    var _t = require('web.core')._t;

    var LoginScreenWidget = screens.ScreenWidget.extend({
        template: 'LoginScreenWidget',

        barcode_product_action: function (code) {
        },
        barcode_discount_action: function (code) {
        },
        barcode_client_action: function (code) {
        },

        init: function (parent, options) {
            this._super(parent, options);
        },

        show: function () {
            var self = this;
            this._super();
            this.renderElement();
            this.$('.pos_invalid_password').val('');
            this.$('.user_password').val('');
            var cashier = this.pos.get_cashier().id;
            for (var i = 0; i < this.pos.users.length; i++) {
                var user = this.pos.users[i];
                if (user.id === cashier) {
                    this.user = user;
                }
            }
            // this.user = this.pos.get_cashier();
            this.chrome.$('.pos-topheader').hide();
            if (this.pos.config.iface_vkeyboard && this.chrome.widget.keyboard) {
                this.chrome.widget.keyboard.connect(this.$('.user_password'));
            }
            this.$el.css({"background-color": _.escape(this.pos.config.bg_color)});
            if (!this.user.pos_security_pin) {
                self.$('.pos_invalid_password').text('Please set a security pin.');
            }
            this.$('.back').click(function () {
                if (self.gui.get_current_screen_param('lock')) {
                    self.gui.show_screen('products');
                    self.chrome.$('.pos-topheader').show();
                    if (self.pos.config.iface_vkeyboard && self.chrome.widget.keyboard) {
                        self.chrome.widget.keyboard.hide();
                    }
                    self.gui.show_popup('lock', {});
                } else {
                    self.gui.close();
                }

            });

            this.$('.login').click(function () {
                var cashier_code = self.$('.user_password').val();
                var user_id = self.pos.db.get_cashier_by_code(cashier_code);

                if (typeof user_id !== 'undefined') {
                    if (!self.gui.get_current_screen_param('lock')) {
                        _super_posmodel.set_start_order.call(self.pos);
                    }
                    self.gui.show_screen('products');
                    self.user.pos_security_pin = user_id.id
                    $('.cashier_number>span').html(user_id.cashier_name);
                    self.chrome.$('.pos-topheader').show();
                    if (self.pos.config.iface_vkeyboard && self.chrome.widget.keyboard) {
                        self.chrome.widget.keyboard.hide();
                    }
                } else {
                    var buffer = self.$('.user_password').val();
                    if ( buffer.length == self.pos.config.pos_lock_cashier_length ) {
                        self.$('.pos_invalid_password').text('Invalid Password');
                        self.$('.user_password').val('');
                    }
                }
            });

            this.$('button.number-char-password').click(function (event) {
                var newbuf = $(event.target).data('action');
                var cashier_code = self.$('.user_password').val();
                self.$('.user_password').val(cashier_code + newbuf);
                $( '.user_password' ).trigger( "change" );
            });

            this.$('button.number-backspace-password').click(function (event) {
                var cashier_code = self.$('.user_password').val();
                self.$('.user_password').val(
                    cashier_code.substring(0, cashier_code.length - 1)
                );
                $( '.user_password' ).trigger( "change" );
            });

            this.$('button.number-clear-password').click(function (event) {
                self.$('.user_password').val('');
            });

            $('.user_password').change(function (e) {
                var buffer = self.$('.user_password').val();
                if ( buffer.length == self.pos.config.pos_lock_cashier_length ) {
                    $('.login').trigger('click');
                }
            });

            $(document).keyup(function (e) {
                if (e.keyCode == 13) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (self.$('.user_password').val() === self.user.pos_security_pin) {
                        if (!self.gui.get_current_screen_param('lock')) {
                            _super_posmodel.set_start_order.call(self.pos);
                        }
                        self.gui.show_screen('products');
                        self.chrome.$('.pos-topheader').show();
                        if (self.pos.config.iface_vkeyboard && self.chrome.widget.keyboard) {
                            self.chrome.widget.keyboard.hide();
                        }
                    } else {
                        var buffer = self.$('.user_password').val();
                        if ( buffer.length == self.pos.config.pos_lock_cashier_length ) {
                            self.$('.pos_invalid_password').text('Invalid Password');
                            self.$('.user_password').val('');
                        }
                    }
                }
            });
        },
        user_icon_url: function (id) {
            return '/web/image?model=res.users&id=' + id + '&field=image';
        },
    });

    gui.define_screen({
        'name': 'login',
        'widget': LoginScreenWidget,
        'condition': function () {
            return this.pos.config.pos_lock;
        },
    });

     models.Order = models.Order.extend({})

    models.PosModel = models.PosModel.extend({
        // set when the user login to session.
        set_start_order: function () {
            var cashier = this.get_cashier().id;
            for (var i = 0; i < this.users.length; i++) {
                var user = this.users[i];
                if (user.id === cashier) {
                    var cashier_pswd = user.pos_security_pin;
                }
            }
            if (!this.config.pos_lock || !cashier_pswd) {
                _super_posmodel.set_start_order.apply(this, arguments);
            }
        },
    });
});
