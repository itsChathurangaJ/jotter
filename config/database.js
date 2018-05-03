if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'ENTER MONGODB URI'}
  } else {
    module.exports = {mongoURI: 'mongodb://localhost/jotter'}
  }