import {calculateBitmaps, readStream} from './functions';

async function main() {
    const input = await readStream(process.stdin);
    return calculateBitmaps(input);
}

main()
    .then(console.log)
    .catch(console.error);