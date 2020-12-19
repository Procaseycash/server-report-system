const fs = require( 'fs' );
const path = require( 'path' );

class FileStorage {

    static filePath = path.resolve( __dirname, '../configs/' );

    static async store(data, fileName = 'secrets') {
        fileName = `${this.filePath}/${fileName}.json`;
        console.log('fileName=', fileName);
        fs.writeFile(fileName, JSON.stringify( data ), (err) => err);
        return data;
    }

    static async get(fileName = 'secrets') {
        try {
            fileName = `${this.filePath}/${fileName}.json`;
            const stringBuffer = (fs.readFileSync(fileName)).toString();
            return stringBuffer ? JSON.parse(stringBuffer) : {};
        } catch ( e ) {
            throw new Error( e.message );
        }
    }
}

module.exports = FileStorage;
