
const Product = require('./model');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const index = async (req, res) => {
    const { search } = req.query;
    let result = {};

    try {
        if (search) {
            result = await Product.findAll({
                where: {
                    name: {
                        [Op.like]: `%${search}%`
                    }
                }
            });

            if (result.length >= 1) {
                res.json({
                    status: 'success',
                    message: 'Data Found',
                    data: result
                });
            } else {
                res.json({
                    status: 'failed',
                    message: 'Data Not Found',
                    data: result
                });
            }

        } else {
            result = await Product.findAll();
            res.json({
                status: 'success',
                message: 'Data Found',
                data: result
            });
        }

    } catch (error) {
        res.json(error);
    }

}

const view = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Product.findAll({
            where: {
                id: parseInt(id)
            }
        });

        if (result.length >= 1) {
            res.json({
                status: 'success',
                message: 'Data Found',
                data: result
            });
        } else {
            res.json({
                status: 'failed',
                message: 'Data Not Found',
                data: result
            });
        }

    } catch (error) {
        res.json(error);
    }



}

const store = async (req, res) => {
    const { users_id, name, price, stock, status } = req.body;
    const image = req.file;

    if (image) {

        const target = path.join(__dirname, '../../public/images', image.filename);
        fs.renameSync(image.path, target);

        try {
            await Product.sync();
            const result = await Product.create({ users_id, name, price, stock, status, image_url: `images/${image.filename}` });

            res.json({
                status: 'success',
                message: 'New Record Created Successfully',
                data: result
            });

        } catch (e) {
            res.json(e);
        }

    }
}

const update = async (req, res, next) => {
    const { users_id, name, price, stock, status } = req.body;
    const { id } = req.params;
    const image = req.file;

    let values = { users_id, name, price, stock, status };

    if (image) {
        const target = path.join(__dirname, '../../public/images', image.filename);
        fs.renameSync(image.path, target);

        values = { users_id, name, price, stock, status, image_url: `images/${image.filename}` };
    }

    const result = await Product.findOne({
        where: {
            id: id
        }
    });

    if (result) {
        try {
            await Product.update(values,
                {
                    where: {
                        id: id
                    }
                });

            removeImage(result.image_url);
            res.json({
                status: 'success',
                message: `Id ${id} has been updated`,
                data: result
            });
        } catch (error) {
            next(error);
        }

    } else {
        res.json({
            status: 'failed',
            message: `Updating failed, data with id ${id} not found`,
            data: {}
        });
    }

}

const destroy = async (req, res, next) => {
    const { id } = req.params;
    const result = await Product.findOne({
        where: {
            id: id
        }
    });

    if (!result) {
        res.status(404).json({
            status: 'failed',
            message: `Id ${id} not found`,
            data: {}
        })
    } else {
        try {
            await Product.destroy({
                where: {
                    id: id
                }
            });

            removeImage(result.image_url);
            res.status(200).json({
                status: 'success',
                message: `Id ${id} has been deleted`,
                data: result,
            })
        } catch (error) {
            next(error);
        }
    }
}

const removeImage = (filePath) => {
    console.log('filePath', filePath);
    console.log('dir name: ', __dirname);

    filePath = path.join(__dirname, '../../public', filePath);
    fs.unlink(filePath, err => console.log(err));

}

module.exports = {
    index,
    view,
    store,
    update,
    destroy
}