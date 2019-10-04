{
  'name': 'POS Customer Name and Order Selector',
  'summary': 'The module adds a dialog windows to select orders. In case of multiple orders, the POS user can then select the order from the dialog windows quickly.',
  'category': 'Point of Sale',
  'version': '1.0',
  'sequence': 1,
  'author': 'Vauxoo',
    'website': 'http://www.vauxoo.com',
    'license': 'LGPL-3',
    'category': 'website',
  'description': '''Odoo POS Customer Name and Order Selector''',
  'depends': ['point_of_sale'],
  'data': [
   'views/pos_order_name_selection_view.xml',
   'views/template.xml',
  ],
  'qweb': ['static/src/xml/pos_order_name_selection.xml'],
  'images': [],
  'application': True,
  'installable': True,
  'auto_install': False
}