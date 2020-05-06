#![allow(unused_variables)]
fn main() {
#[derive(Debug)]
enum UsState {
    Alabama,
    Alaska,
}

enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState),
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => {
            print!("State quarter from {:?}!",state);
            25
        },
    }
}

value_in_cents(Coin::Quarter(UsState::Alabama));
value_in_cents(Coin::Quarter(UsState::Alaska));

}
