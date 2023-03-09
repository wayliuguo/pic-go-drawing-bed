export namespace zoo {
    export class Dog {
        log() {
            console.log('zoo dog')
        }
    }
}

export namespace home {
    export class Dog {
        log() {
            console.log('home dog')
        }
    }
}

const zooDog = new zoo.Dog()
const homeDog = new home.Dog()
zooDog.log()
homeDog.log()