let deck22 = {
    suits: ['hearts', 'spades', 'clubs', 'diamonds'],
    cards: Array(52),
    createCardPicker: function () {
        return () => {
            let pickedCard = Math.floor(Math.random() * 52)
            let pickedSuit = Math.floor(pickedCard / 13)

            return {
                suit: this.suits[pickedSuit],
                card: pickedCard % 13
            }
        }
    }
}

let cardPicker22 = deck22.createCardPicker()
let pickedCard22 = cardPicker22()

console.log('card:' + pickedCard22.card + ' of ' + pickedCard22.suit)