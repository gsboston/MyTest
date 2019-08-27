// this
// ts可以通知this错误位置，js只能在调用时指出

let deck = {
    suits: ['hearts', 'spades', 'clubs', 'diamonds'],
    cards: Array(52),
    createCardPicker: function () {
        return function () {
            let pickedCard = Math.floor(Math.random() * 52)
            let pickedSuit = Math.floor(pickedCard / 13)

            return {
                suit: this.suits[pickedSuit],
                card: pickedCard % 13
            }
        }
    }
}

let cardPicker = deck.createCardPicker()
let pickedCard = cardPicker()

console.log('card:' + pickedCard.card + ' of ' + pickedCard.suit)
// 这时会报错，this.suits是undefined，原理与js一致，createCardPicker内返回的函数在执行的时候
// 执行上下文是全局，当前this指向的是全局对象。
// 解决方案：箭头函数，将return返回的函数改为箭头函数
// 如果你给编译器设置了--noImplicitThis标记，ts会警告你有一个错误，
// this.suits的this的类型会被推断为any，因为this是来自这个对象字面量的一个函数表达式，无法推断this是deck对象
// 解决方案，给函数提供一个显式的this参数

// function f(this:void){}

interface Card {
    suit: string
    card: number
}

interface Deck {
    suits: string[]
    cards: number[]
    createCardPicker(this: Deck): () => Card
}

let deck2: Deck = {
    suits: ['hearts', 'spades', 'clubs', 'diamonds'],
    cards: Array(52),
    createCardPicker: function (this: Deck) {
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
let cardPicker2 = deck2.createCardPicker()
let pickedCard2 = cardPicker2() 
console.log('card:' + pickedCard2.card + ' of ' + pickedCard2.suit)
// 此时this.suits的this就会被推断成Deck类型


// 回调函数的this =====================================================
// 可以在第三方库中为this的回调函数指定this参数

interface UIElement {
    addClickListener(onclick: (this: void, e: Event) => void): void
}

class Handler {
    type: string

    onClickBad(this: Handler, e: Event) {
        this.type = e.type
    }
}

let h = new Handler()

// 定义一个UIElement类型的变量
let uiElement: UIElement = {
    addClickListener() { }
}

// uiElement.addClickListener(h.onClickBad) // error

// 报错，传入的Handler中的onClickBad的this与接口声明的this不符
// 步骤1
// onClickBad(this: void, e: Event) {
//     this.type = e.type
// }
// 但是访问不到this
// 2.箭头函数
// onClickBad = (e: Event) => {
//     this.type = e.type
// }
// 因为箭头函数不会捕获this，所以你总是可以把它们传给期望this: void的函数。
// 缺点是每个 Handler对象都会创建一个箭头函数。 另一方面，方法只会被创建一次，添加到 Handler的原型链上。 
// 它们在不同 Handler对象间是共享的。


// 重载==========================================================
// js本身是一个动态语言，函数也是可以根据不同的参数返回不同类型的数据
// 多个同名函数，通过参数数量或者类型不同或者返回值不同
// 重载要有具体实现，重载是重载，不论几个重载都要有实现，实现的类型和返回值类型要包含所有重载

// 两个重载，定义重载的时候，精确的放到前面，
// 查找重载列表的时候，从上至下尝试，符合就使用。
let suits = ["hearts", "spades", "clubs", "diamonds"];
function pickCard2(x: { suit: string; card: number }[]): number
function pickCard2(x: number): { suit: string; card: number }

// 重载函数的实现
function pickCard2(x): any {
    if (Array.isArray(x)) {
        return 1
    } else if (typeof x === 'number') {
        return { suit: '5', card: 12 }
    }
}
// 注意，function pickCard(x): any并不是重载列表的一部分，
// 因此这里只有两个重载：一个是接收对象另一个接收数字。 以其它参数调用 pickCard会产生错误。
