
const Category = require('../models/category.model');

exports.create=(req, res)=>{
    const category={
        category:req.body.category
    }
    Category.create(category).then((data)=>{
        return res.status(200).json({result: data});
    }).catch((error)=>{

        return res.status(200).json({result: error});
    })
}

exports.findAll = (req, res) => {
  Category.findAndCountAll()
    .then((data) => {
      return res.status(200).json({ result: data });
    })
    .catch((error) => {
      return res.status(500).json({ result: error });
    });

};

exports.findOne = (req, res) => {

  const id = req.params.id;

  Category.findOne({ where: { id: id } })

    .then((data) => {

      return res.status(200).json({ result: data });

    })

    .catch((error) => {

      return res.status(500).json({ result: error });

    });

};



exports.update = (req, res) => {

  const id = req.params.id;

  const category = {

    category: req.body.category,

  };

  Category.update(category, { where: { id: id } })

    .then((data) => {

      return res.status(200).json({ result: data });

    })

    .catch((error) => {

      return res.status(200).json({ result: error });

    });

};



exports.delete = (req, res) => {

  const id = req.params.id;

  Category.destroy({ where: { id: id } })

    .then((data) => {

      return res.status(200).json({ result: data });

    })

    .catch((error) => {

      return res.status(500).json({ result: error });

    });

};