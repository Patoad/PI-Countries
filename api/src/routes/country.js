require('dotenv').config();
const { Router } = require('express');
const router = Router();
const { Country, Activity } = require('../db');
const axios = require('axios');
const { Op } = require("sequelize");

const url = `https://restcountries.com/v3/all`;


const getApiInfo = async () => {
    try {
        const apiUrl = await axios.get(url)
        let ApiInfo = await apiUrl.data.map(el => {
            return {
                id: el.cca3,
                name: el.name.common,
                capital: el.capital ? el.capital.join(", ") : "None",
                subregion: el.subregion,
                area: el.area,
                population: el.population,
                flags: el.flags[1],
                created: false      
            }
        })
        return ApiInfo;
    }catch (error){
        console.log(error);
    }
};

const getDbInfo = async () => {    
    const infoDB = await Country.findAll({
            include: [{
                model: Activity,
                attributes: ['name'],
                through: {
                attributes: [],
                },
            }],
        attributes: ["id","name","capital","subregion", "area", "population", "flags", "created"]
    });
    return infoDB;    
}

const getAllCountries = async () =>{
    const apiUrl = await axios.get("https://restcountries.com/v3/all");
    const api = await apiUrl.data.map((el) => {
        return {
            id: el.cca3,
            name: el.name.common,
            capital: el.capital ? el.capital.join(", ") : "None",
            subregion: el.subregion,
            area: el.area,
            population: el.population,
            flags: el.flags[1],
        }
    })
}

//-----------------------------------------------------------

const getCountryByIdApi = async (code) => {
    const apiUrl = await axios.get(`https://restcountries.com/v3/alpha/${code}`);
    const countryData = {
        id: apiUrl.data.id,
        name: apiUrl.data.name,
        flags: apiUrl.data.flags[1],
        capital: apiUrl.data.capital ? capital.join(", ") : "None",
        subregion: apiUrl.data.subregion,
        area: apiUrl.data.area,
        population: apiUrl.data.population,
    }
    return countryData;
};

const getCountryByNameApi = async (name) => {
    try {
        const apiNames = await axios.get(`https://restcountries.com/v3/name/${name}`);
        const apiNamesData = apiNames.data.results.map(e => {
            return {
                id: el.cca3,
                name: el.name.common,
                capital: el.capital ? el.capital.join(", ") : "None",
                subregion: el.subregion,
                area: el.area,
                population: el.population,
                flags: el.flags[1],
                created: false 
            }
        });
        let array = [];
        if(apiNamesData.length > 10){
            for(let i = 0; i <= 9; i++){
                array.push(apiNamesData[i]);
            }
            return array;
        }
        return apiNamesData;
    }catch(e){
        console.log(e);
    }
};

const getGameByNameBd = async (name) => {
    try {
        const countries = await Country.findAll({
            where: {
                name: { [Op.iLike]: `%${name}%` }
            },
            include: [{
                model: Activity,
                attributes: ['name'],
                through: {
                attributes: [],
                },
            }],
            attributes: ["id","name","flags"]
        });
        return countries;
    }catch(e){
        console.log(e);
    }
};


const getByNameTotal = async (name) => {
    try{
        const apiName = await getCountryByNameApi(name);
        const dbName = await getCountryByNameBd(name);
        const totalNames = apiName.concat(dbName);
        return totalNames;
    }catch(e){
        console.log(e)
    }
}



router.get('/', async (req, res) => {
    const name = req.query.name;
    const countriesAll = await getApiInfo();
    const countriesByName = await getByNameTotal(name);
    if (name) {
        const countriesName = await countriesByName.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
        countriesName.length?
            res.status(200).send(countriesName) :
            res.status(404).send("The country you're looking for does not exist... yet");
    }else{
        res.status(200).send(countriesAll)
    }
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        if(isNaN(id)){
            const people = await Country.findByPk(id, {
                include: {
                        model: Activity,
                        attributes: ["name"],
                        through: {
                        attributes: [],
                        }
                }
            })
            res.json(people);
        }else{
            res.json(await getCountryByIdApi(id));
        }
    }catch(err) {
        console.log(err)
    }
});


router.post('/', async (req, res, next)=>{
    const { name, difficulty, duration, season, countries } = req.body;
    try{
        const newActivity = await Activity.create({ name, difficulty, duration, season, countries } );
        countries.forEach(async (country) => {
            let activityCountry = await Country.findOne({ where: { name: country } });
            await newActivity.addCountry(activityCountry);
        });
        return res.status(201).send(newActivities);
    } catch (error) {
    console.log(error);
    }
});

router.delete('/:id', async (req, res, next)=>{
    try{
    const id = req.params.id;
    Country.destroy({where: {id}})
    res.send("The activity is not being practiced here anymore!")
    }
    catch(error){
        next(error)
    }
})



module.exports = router