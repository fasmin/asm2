var express = require('express')
var app = express()
var mongodb = require('mongodb');
app.set('view engine', 'hbs')
app.use(express.urlencoded({
    extended: true
}))

var MongoClient = require('mongodb').MongoClient
var url = 'mongodb+srv://quan1407:phh05012002@cluster0.h35noem.mongodb.net/test'

app.get('/', async(req, res) => {
    let server = await MongoClient.connect(url)
    let dbo = server.db("ATNToys")
    let products = await dbo.collection('products').find().toArray()

    res.render('home', {
        'products': products,
    })
})

app.post('/search',async (req,res)=>{
    let name = req.body.txtName

    //1. ket noi den server co dia chi trong url
    let server = await MongoClient.connect(url)
    //truy cap Database ATNToys
    let dbo = server.db("ATNToys")
    //get data
    let products = await dbo.collection('products').find({'name': new RegExp(name,'i')}).toArray()
    res.render('home',{'products':products})
})

app.get('/delete/:id', async(req, res) => {
    let server = await MongoClient.connect(url)
    let dbo = server.db("ATNToys")
    await dbo.collection('products').deleteOne({
        _id: mongodb.ObjectId(req.params.id)
    })

    res.redirect('/')
})

app.post('/newProduct', async (req,res)=>{
    let name = req.body.txtName
    let price = req.body.txtPrice
    let picture = req.body.txtPicture
    if (name.length <= 2) {
        res.render('newproduct', {'nameError': 'Name must be at least 2 characters'})
        return
    }
    for(i=0;i<price.length; i++){
        if(isNaN(price[i])){
            res.render('newproduct', {'priceError': 'Price must be number'})
            return
        }
    }

    let product = {
        'name': name,
        'price': price,
        'picture': picture
    }
    //1. ket noi den server co dia chi trong url
    let server = await MongoClient.connect(url)
    //truy cap Database ATNToys
    let dbo = server.db("ATNToys")
    //insert product
    await dbo.collection("products").insertOne(product)
    //quay lai trang home
    res.redirect('/')
})

app.get('/insert', (req, res) => {
    res.render('newProduct')
})

app.get('/',(req,res)=>{
    res.render('home')
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('server is running')