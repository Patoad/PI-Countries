require('dotenv').config();
const { key } = process.env;
const { Router } = require('express');
const router = Router();
const { Country, Activity } = require('../db');
const axios = require('axios');
const { Op } = require("sequelize");

const url = `https://restcountries.com/v3/all?key=${key}&&limit=100`;


const getApiInfo = async () => {
    try {
        let Page1 = axios.get(`${url}&page=1`);
        let Page2 = axios.get(`${url}&page=2`);
        let Page3 = axios.get(`${url}&page=3`);
        let Page4 = axios.get(`${url}&page=4`);
        let Page5 = axios.get(`${url}&page=5`);

        let allPages = await Promise.all([Page1, Page2, Page3, Page4, Page5]);  

        Page1 = allPages[0].data.results;
        Page2 = allPages[1].data.results;
        Page3 = allPages[2].data.results;
        Page4 = allPages[3].data.results;
        Page5 = allPages[4].data.results;       

        let apiHtml = Page1.concat(Page2).concat(Page3).concat(Page4).concat(Page5);                  
            
        let ApiInfo = apiHtml.map(el => {
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

// const getCountryByIdApi = async (id) => {
//     const apiUrl = await axios.get(`https://api.rawg.io/api/games/${id}?key=${key}`);
//     const gameData = {
//         id: apiUrl.data.id,
//         name: apiUrl.data.name,
//         image: apiUrl.data.background_image,
//         genres: apiUrl.data.genres.map(e => e.name),
//         description: apiUrl.data.description.replace(/<[^>]+>/g, ''),
//         released: apiUrl.data.released,
//         rating: apiUrl.data.rating,
//         platforms: apiUrl.data.platforms.map(e => e.platform.name)
//     };
//     return gameData;
// };

// const getGameByNameApi = async (name) => {
//     try {
//         const apiNames = await axios.get(`https://api.rawg.io/api/games?search=${name}&key=${key}`);
//         const apiNamesData = apiNames.data.results.map(e => {
//             return {
//                 id: e.id,
//                 name: e.name,
//                 image: e.background_image,
//                 genres: e.genres.map(e => e.name)
//             }
//         });
//         let array = [];
//         if(apiNamesData.length > 15){
//             for(let i = 0; i <= 14; i++){
//                 array.push(apiNamesData[i]);
//             }
//             return array;
//         }
//         return apiNamesData;
//     }catch(e){
//         console.log(e);
//     }
// };

// const getGameByNameBd = async (name) => {
//     try {
//         const games = await Videogame.findAll({
//             where: {
//                 name: { [Op.iLike]: `%${name}%` }
//             },
//             include: [{
//                 model: Genre,
//                 attributes: ['name'],
//                 through: {
//                 attributes: [],
//                 },
//             }],
//             attributes: ["id","name","image"]
//         });
//         return games;
//     }catch(e){
//         console.log(e);
//     }
// };


// const getByNameTotal = async (name) => {
//     try{
//         const apiName = await getGameByNameApi(name);
//         const dbName = await getGameByNameBd(name);
//         const totalNames = apiName.concat(dbName);
//         return totalNames;
//     }catch(e){
//         console.log(e)
//     }
// }






// router.get('/', async (req, res) => {
//     const name = req.query.name;
//     const gamesAll = await getAllGames();
//     const gamesByName = await getByNameTotal(name);
//     if (name) {
//         const gamesName = await gamesByName.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
//         gamesName.length?
//             res.status(200).send(gamesName) :
//             res.status(404).send("The game you're looking for does not exist... yet");
//     }else{
//         res.status(200).send(gamesAll)
//     }
// });


// router.get('/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//         if(isNaN(id)){
//             const player = await Videogame.findByPk(id, {
//                 include: {
//                         model: Genre,
//                         attributes: ["name"],
//                         through: {
//                         attributes: [],
//                         }
//                 }
//             })
//             res.json(player);
//         }else{
//             res.json(await getGameByIdApi(id));
//         }
//     }catch(err) {
//         console.log(err)
//     }
// });


// router.post('/', async (req, res, next)=>{
//     const { name, image, description, released, rating, platforms, genres } = req.body;
//     try{
//         const newVideogame = await Videogame.create({ name, image, description, released, rating, platforms });
//         const genreDb = await Genre.findAll({
//             where: {
//                 name: genres}
//         });
//         newVideogame.addGenre(genreDb)
//         res.send("THE GAME HAS JOINED THE ORDER!")
//     }catch(error){
//         next(error)
//     }
// });


// router.delete('/:id', async (req, res, next)=>{
//     try{
//     const id = req.params.id;
//     Videogame.destroy({where: {id}})
//     res.send("The game has been destroyed, it was corrupted by the Dark Side 😔")
//     }
//     catch(error){
//         next(error)
//     }
// }) 



module.exports = router