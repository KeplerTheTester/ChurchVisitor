var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');

var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

var datetime = new Date();
var addWords = function(filename, word)
{
    fs.appendFile(filename,'\n'+ word, function(err)
    {
        if(err)
        {
            throw err
        }
        //console.log("added something to file");
    });
}

var addWords2 = function(filename, word)
{
    fs.appendFile(filename, word, function(err)
    {
        if(err)
        {
            throw err
        }
        //console.log("added something to file");
    });
}

var readFile = function(fileName)
{
    return fs.readFileSync(fileName, 'utf8');
    
}

var getPassword = function(fileName)
{
    return readFile(fileName).split('\n').shift();
}

var deleteInfo = function()
{
    fs.writeFile('readMe.txt', "", function(err){
        if(err)
            throw err;
    });
}

app.get('/', function(req, res)
{
    res.render('home');
});


app.get('/test', function(req, res)
{

    res.send('test');
    
});

app.get('/signIn', function(req, res)
{
    res.render('signInView');
});
app.post('/signIn',urlencodedParser, function(req, res){
    //console.log(req.body);
    var name = req.body.name;
    var firstTimeVisit = req.body.church;
    var churchFrom = req.body.address;

    addWords('readMe.txt',
    name+':'+firstTimeVisit+':'+churchFrom);
    res.render('signInView');
   
});

var parseFile = function(something)
{
    var test =[];
    var lines = something.split('\n');
    for(var i=0; i<lines.length; i++)
    {
        test.push(lines[i]);
    }
    return test;
}

var addAllVisitorsWithDate = function(){

}

app.get('/view', function(req, res)
{
    var holder =" ";
    var some = readFile('readMe.txt');
    var one = parseFile(some);
    console.log(some);
    console.log(one);
    if(holder.length < some.length)
    {
        //res.render('visitors', {data: some});
        res.render('visitors', {data: one});
    
    }
    else
    {
        res.render('visitors', {data: holder});
    }
    //getPassword('password.txt');
    
    
});
app.post('/view',urlencodedParser ,function(req, res)
{
    console.log(req.body.password);
    var userInput = (req.body.password).trim();
    var words = parseFile(readFile('readMe.txt'));
    console.log(words);
    var visitorsArray = [];
    visitorsArray = words;
    console.log(visitorsArray[1]);
    var savePassword = getPassword('password.txt').trim();
    //console.log(userInput+"  "+savePassword);
    if(userInput === savePassword)
    {
        deleteInfo();
       //S console.log("Correct");
        let output ='\n'+ 'day '+datetime.getDate()+
        ' month '+(datetime.getMonth()+1)
        +' year '+datetime.getFullYear()+'\n';
        addWords('visitorsInfo.txt', output);
        console.log(visitorsArray.length);
        for(var i=0; i<visitorsArray.length; i++)
        {
            addWords('visitorsInfo.txt', visitorsArray[i]);
        }
        var hold = [];
        res.render('visitors', {data: hold});
    }
    else{
        console.log("incorrect");
        res.render('wrongPassword');
    }
    //deleteInfo();
    
});



app.listen(3000,'0.0.0.0');