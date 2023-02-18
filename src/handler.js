const { nanoid } = require('nanoid');
const notes = require('./notes');


const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;

    const id = nanoid(16);
    const now = new Date();
    const createdAt = now.toISOString();
    const updatedAt = createdAt;

    const newNote = {
        title,
        tags,
        body,
        id,
        createdAt,
        updatedAt
    };
    notes.push(newNote);

    // menentukan apakah newNote sudah masuk ke dalam array notes
    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            mesage: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'faul',
        message: 'Catatan gagal ditambahkan',
    });
    response.code(500);
    return response;
}

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

const getNoteByIdHandler = (request, h) => {
    // mendapatkan nilai id
    const { id } = request.params;


    //dapatkan objek note dengan id tersebut dari objek array notes
    const note = notes.filter((n) => n.id === id)[0];

    if (note !== undefined) {
        return {
            statrus: 'success',
            data: {
                note,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editNoteByIdHandler = (request, h) => {
    // mendapatkan nilai id
    const { id } = request.params;

    // dapatkan data notes terbaru yang dikirimkan oleh client melalui body request.
    const { title, tags, body } = request.payload;

    // kita perlu perbarui juga nilai dari properti updatedAt. Jadi, dapatkan nilai terbaru dengan menggunakan new Date().toISOString().
    const updatedAt = new Date().toISOString();

    // Pertama, dapatkan dulu index array pada objek catatan sesuai id yang ditentukan. Untuk melakukannya, gunakanlah method array findIndex().
    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt
        };

        const response = h.response({
            status: 'success',
            mesage: 'Catatan berhasil diperbarui',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        mesage: 'Gagal memperbarui catatan. Id tidak ditemukan',
    });

    response.code(404);
    return response;
}

const deleteNoteByIdHandler = (request, h) => {
    // dapatkan dulu nilai id yang dikirim melalui path parameters.
    const { id } = request.params;

    // dapatkan index dari objek catatan sesuai dengan id yang didapat
    const index = notes.findIndex((note) => note.id === id);

    // Lakukan pengecekan terhadap nilai index, pastikan nilainya tidak -1 bila hendak menghapus catatan. Nah, untuk menghapus data pada array berdasarkan index, gunakan method array splice()
    if (index !== -1) {
        notes.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'catatan berhasil dihapus',
        });
        response.code(200);
        return response;
    }
    // Bila index bernilai -1, maka kembalikan handler dengan respons gagal.
    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. id tidak ditemukan',
    });
    response.code(404);
    return response;
};
module.exports = { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler }; //literals