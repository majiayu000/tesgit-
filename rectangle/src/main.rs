fn main() {
   
    let weight1 = 40;
   
    let height1 = 50;

    println!("the area is {}", area(weight1,height1))

}

fn area(weight: u32, height: u32) -> u32 {
    weight*height
}
