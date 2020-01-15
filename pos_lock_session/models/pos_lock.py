# -*- coding: utf-8 -*-

from odoo import models, fields, api


class PosLockConfig(models.Model):
    _inherit = 'pos.config'

    pos_lock = fields.Boolean(string='Enable Lock Screen')
    pos_lock_cashier_length = fields.Integer(string='Cashier code length')
    bg_color = fields.Char(
        'Background Color', default='rgb(218, 218, 218)',
        help='The background color of the lock screen,'
             ' (must be specified in a html-compatible format)')


class PosOrder(models.Model):
    _inherit = 'pos.order'

    cashier_id = fields.Many2one('pos.cashier', string='Cashier')

    @api.model
    def _process_order(self, pos_order):
        order = super(PosOrder, self)._process_order(pos_order)
        if 'cashier_id' in pos_order:
            order.cashier_id = pos_order['cashier_id']
        return order



class PosCashierNumber(models.Model):
    _name = 'pos.cashier'
    _description = 'Pos Cashier and lock screen'
    _rec_name = 'cashier_name'

    cashier_name = fields.Char(string='Name')
    cashier_code = fields.Integer(string='Code')

    _sql_constraints = [
        ('unique_cashier_code',
         'unique (cashier_code)',
         'Cashier code already exists!')
    ]
