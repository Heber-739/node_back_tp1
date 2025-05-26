const { readFile, writeFile } = require("./data.service");

const ALUMNS_FILE = require("path").join(__dirname, "../data/alumnos.json");

class AlumnsService {
    
    getAllAlumnsByCourse = (alumns) => {
        const data = readFile(ALUMNS_FILE);
        const response = data.filter((a)=>alumns.includes(a.id))
        return response
    }
    
}

const alumnService = new AlumnsService();

module.exports = alumnService;