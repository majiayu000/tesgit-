
fn main() {
 
  //  let a = 0;
   // let b = 1;

    let  d = feb(23);

    println!("is {}",d);
    
}
fn feb(c:i32) -> i32 {
    if c == 1 {
        return 1;
    }
    else if c == 2 {
        return 1;
    }
    else {
         
        return feb(c-2) + feb(c-1);
    };
    
}
