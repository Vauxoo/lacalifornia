# -*- coding: utf-8 -*-

from odoo import models, fields


class PosLockConfig(models.Model):
    _inherit = 'pos.config'

    pos_lock = fields.Boolean(string='Enable Lock Screen')
    bg_color = fields.Char(
        'Background Color', default='rgb(218, 218, 218)',
        help='The background color of the lock screen,'
             ' (must be specified in a html-compatible format)')


class PosOrder(models.Model):
    _inherit = 'pos.order'

    cashier_id = fields.Many2one('pos.cashier', string='Cashier')


class PosCashierNumber(models.Model):
    _name = 'pos.cashier'

    cashier_name = fields.Char(string='Name')
    cashier_code = fields.Integer(string='Code')

    _sql_constraints = [
        ('unique_cashier_code',
         'unique (cashier_code)',
         'Cashier code already exists!')
    ]
