import express, { Request, Response, Errback } from "express";
import cors from "cors";
import { biblioteca, usuarios } from "./data";
import { log } from "console";

const app = express();

app.use(express.json());

app.use(cors());

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

app.get("/", (req: Request, res: Response) => {
  res.send("Asdasda");
});
function findUserById(userId: string) {
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].id === userId) {
      return { user: usuarios[i], index: i };
    }
  }
  return null;
}

function findBookById(livroId: string) {
  for (let i = 0; i < biblioteca.length; i++) {
    if (biblioteca[i].id === livroId) {
      return { user: biblioteca[i], index: i };
    }
  }
  return null;
}

function updateBookStatus(livroId: string) {
  for (let i = 0; i < biblioteca.length; i++) {
    if (biblioteca[i].id === livroId) {
      return (biblioteca[i].status = "Emprestado");
    }
  }
}

app.put("/user/:userId?/emprestimo/:livroId?/", (req: Request, res: Response) => {
  try {
    const { userId, livroId } = req.params;

    console.log(`${userId} - ${livroId}`);
    

    if (!userId && !livroId) {
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

    res.status(201).json( {message: `Livro Pego com Sucesso!`, livro: {livro}} );
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

app.listen(3003, () => {
  console.log("Server is running in http://localhost:3003");
});
