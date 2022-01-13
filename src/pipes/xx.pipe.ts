import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name : 'xx'
})
export class xxPipe implements PipeTransform{
  transform(value: number): string {
    if(value===0)
      return ''
    else if(value===1 )
      return "X"
    else return 'O'
  }
}
