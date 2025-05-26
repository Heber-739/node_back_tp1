const { readFile, writeFile } = require("./data.service");

const ALUMNS_FILE = require("path").join(__dirname, "../data/alumnos.json");

class AlumnsService {
    
    getAllAlumnsByIds = (alumns) => {
        const data = readFile(ALUMNS_FILE);
        const response = data.filter((a)=>alumns.includes(String(a.id)))
        return response
    }
    
}

const alumnService = new AlumnsService();

module.exports = alumnService;