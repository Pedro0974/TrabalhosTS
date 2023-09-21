"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const data_1 = require("./data");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// app.post("livro/", (req: Request, res: Response) => {
//   try {
//     const { titulo, autor, ano_de_publicacao } = req.body;
//     if(!titulo || !autor || ano_de_publicacao) {
//         res.status(400)
//         throw new Error('Bad Request, missing fields.')
//     }
//     if( typeof ano_de_publicacao === 'number') {
//     }
//   } catch (err: any) {
//     res.send(err);
//   }
//   res.send();
// });
function findUserById(userId) {
    for (let i = 0; i < data_1.usuarios.length; i++) {
        if (data_1.usuarios[i].id === userId) {
            return { user: data_1.usuarios[i], index: i };
        }
    }
    return null;
}
function findBookById(livroId) {
    for (let i = 0; i < data_1.biblioteca.length; i++) {
        if (data_1.biblioteca[i].id === livroId) {
            return { user: data_1.biblioteca[i], index: i };
        }
    }
    return null;
}
function updateBookStatus(livroId) {
    for (let i = 0; i < data_1.biblioteca.length; i++) {
        if (data_1.biblioteca[i].id === livroId) {
            return data_1.biblioteca[i].status = 'Emprestado';
        }
    }
}
app.put("user/:userId/emprestimo/:livroId", (req, res) => {
    try {
        const userId = req.params.userId;
        const livroId = req.params.livroId;
        if (!userId || !livroId) {
            res.status(404);
            throw new Error("Parametros não Encontrados!");
        }
        const user = findUserById(userId);
        if (!user) {
            res.status(404);
            throw new Error("Usuário não Encontrado");
        }
        const livro = findBookById(livroId);
        if (!livro) {
            res.status(404);
            throw new Error("Livro não Encontrado");
        }
        updateBookStatus(livroId);
        res.status(200).send(`Livro Pego com Sucesso! ${livroId}`);
    }
    catch (err) {
        res.send(err);
    }
});
app.listen(3003, () => {
    console.log("Server is running in http://localhost:3003");
});
