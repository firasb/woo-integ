const phpVar = require('locutus/php/var');
const helpers = require('../helpers');

let WooCommerce = {};

WooCommerce.Items = {
    getItems: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let conn = await helpers.MySql.getConnection();
                //let items = await conn.query("SELECT * FROM `wp_posts` WHERE post_type = 'product'");
                let items = await conn.query(`SELECT
                p.ID AS product_id, p.post_title AS product_name, p.post_content AS product_description, p.post_excerpt AS product_model, p.post_name AS product_slug, t.term_id AS category_id, t.name AS category_name, t.slug AS category_slug, iclt.language_code
                FROM wp_terms t INNER JOIN wp_term_taxonomy tt
                ON t.term_id = tt.term_id
                INNER JOIN wp_term_relationships tr
                ON tr.term_taxonomy_id = tt.term_taxonomy_id
                INNER JOIN wp_posts p
                ON tr.object_id = p.ID
                INNER JOIN wp_icl_translations iclt
                ON iclt.element_id = tr.object_id
                INNER JOIN wp_postmeta pm
                ON p.ID = pm.post_id
                WHERE tt.taxonomy = 'product_cat' AND p.post_type = 'product'
                order by iclt.trid`);

                try {
                    await conn.release();
                }
                catch (ex) { }

                resolve(items);
            }
            catch (ex) {
                reject(ex);
            }
        })
    },
    getItemDetails: (itemID) => {
        return new Promise(async (resolve, reject) => {
            try {
                let conn = await helpers.MySql.getConnection();
                //let items = await conn.query("SELECT * FROM `wp_posts` WHERE post_type = 'product'");
                let items = await conn.query(`SELECT
                p.ID AS product_id, p.post_title AS product_name, p.post_content AS product_description, p.post_excerpt AS product_model, p.post_name AS product_slug, t.term_id AS category_id, t.name AS category_name, t.slug AS category_slug, iclt.language_code
                FROM wp_terms t INNER JOIN wp_term_taxonomy tt
                ON t.term_id = tt.term_id
                INNER JOIN wp_term_relationships tr
                ON tr.term_taxonomy_id = tt.term_taxonomy_id
                INNER JOIN wp_posts p
                ON tr.object_id = p.ID
                INNER JOIN wp_icl_translations iclt
                ON iclt.element_id = tr.object_id
                INNER JOIN wp_postmeta pm
                ON p.ID = pm.post_id
                WHERE tt.taxonomy = 'product_cat' AND p.post_type = 'product' AND p.id = ?`, [itemID]);

                let item = items[0];
                let meta = await conn.query(`SELECT * FROM wp_postmeta WHERE post_id = ?`, [itemID]);
                let attributes = {};
                item['meta'] = {};
                meta.forEach(meta_row => {
                    let value = meta_row.meta_value;
                    if(meta_row.meta_key == '_product_attributes') {
                        value = phpVar.unserialize(meta_row.meta_value);
                        Object.keys(value).forEach(function(key) {
                            attributes[value[key]['name']] = value[key]['value'];
                        });
                        value = attributes;
                    }
                    item['meta'][meta_row.meta_key] = value;
                });

                try {
                    await conn.release();
                }
                catch (ex) { }

                resolve(item);
            }
            catch (ex) {
                reject(ex);
            }
        })
    }
}

module.exports = WooCommerce;