const fs = require("fs"); // <--- faltaba esta línea
const { readFile, writeFile } = require("./data.service");
const path = require("path");

const ALUMNS_FILE = path.join(__dirname, "../data/alumnos.json");

class AlumnsService {

    getAllAlumnsByIds = (alumns) => {
        const data = readFile(ALUMNS_FILE);
        const response = data.filter((a) => alumns.includes(String(a.id)))
        return response
    }
    
    getAllAlumns = () => {
        try {
            const data = fs.readFileSync(ALUMNS_FILE, 'utf-8');
            const alumnos = JSON.parse(data);
            return alumnos;
        } catch (error) {
            console.error("Error leyendo archivo de alumnos:", error);
            return [];
        }
    }

}

const alumnsService = new AlumnsService();

module.exports = {
    alumnsService,
};