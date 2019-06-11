var express = require('express');
var app = express();
var axios = require('axios');

app.get('/', function (req, res) {
	getPdf().then(response => {
		res.json(response.data);
	}).then(response => {
		console.log(response);
	})
});

const getPdf = () => {

	const body = {
		"name": "matu",
		"email": "matu@gmail.com"
	}
	
	try {
    	return axios.post('https://api.docupilot.app/api/v1/templates/4434/merge?folder=157', body, {
    		headers: { 
    			'content-type': 'application/json',
    			'apikey': '3e42cc2b9de3621f8f9bfdffcb0761c3'
    		}
    	})
  	} 
  	catch (error) {
    	console.error(error)
  	}
};

const showPdf = (url) => {
	
	try {
    	return axios.get(url)
  	} 
  	catch (error) {
    	console.error(error)
  	}
};

var server = app.listen(8080, function () {
   var port = server.address().port;
   console.log("App listening port%s", port)
});

