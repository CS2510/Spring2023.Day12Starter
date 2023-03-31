class Time{
  static deltaTime = .01
  static time = 0
  static update(){
    Time.time += Time.deltaTime
  }
}

window.Time = Time
export default Time;