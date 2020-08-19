export const url = 'https://polar-falls-02493.herokuapp.com/';

export const FileService = {
    getFiles: () => {
        return fetch(url + 'file/list-files')
            .then(response => response.json());
    },
    selectFile: (fileName) => {
        return fetch(url + 'file/select-file?file=' + fileName);
    },

    getSubjects: () => {
        return fetch(url + 'process/get-subjects')
            .then(response => response.json());
    },

    getLetters: (bodyObj) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyObj)
        };
        return fetch(url + 'process/get-letters', requestOptions)
            .then(response => response.json());
    }
};
