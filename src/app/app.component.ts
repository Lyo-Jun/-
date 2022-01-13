import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  grid: number[][] = Array.from(Array(3),
    () => Array<number>(3).fill(0))
  //没有子标记为0，玩家下的子标记为1，程序下的子标记为2
  canPlay: boolean = true
  count: number = 9
  winner: 'AI' | '玩家'
  ma: [number, number][] = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2],
    [2, 0], [2, 1], [2, 2]]

  //玩家尝试下子
  tryDumpIt(x: number, y: number): void {
    //如果这个方格已经下过子了或者游戏已经结束了，直接返回
    if (!this.canPlay || this.grid[x][y] !== 0)
      return
    //将这个方格置为1，并且将可下方格数count减1
    this.grid[x][y] = 1
    this.count--
    //检查玩家下完子之后是否有人赢了，如果赢了，将
    //不可再下子，将this.canPlay设置为false
    if (this.checkIfSomeOneWins()) {
      this.canPlay = false
    }
    //模拟机器下棋，在100毫秒之后让程序下棋
    setTimeout(() => this.aiMove(), 100)
  }

  //电脑下子
  aiMove(): void {
    //如果没有格子可以下了或者游戏已经出结果，直接返回
    if (this.count === 0 || !this.canPlay)
      return
    //电脑想要最低的分数，所以将bestScore设置为Infinity
    let bestScore = Number.MAX_VALUE
    let move: [number, number]
    //遍历每一个可下的格子，选取分数最小的那个格子来下子
    for (let [i, j] of this.ma) {
      if (this.grid[i][j] !== 0)
        continue
      this.grid[i][j] = 2
      this.count--
      let score = this.miniMax(Number.MIN_VALUE, Number.MAX_VALUE, true, this.count)
      this.count++
      this.grid[i][j] = 0
      if (score < bestScore) {
        bestScore = score
        move = [i, j]
      }
    }
    //下子操作
    this.grid[move[0]][move[1]] = 2
    this.count--
    //如果有人赢了，设置不可操作
    if (this.checkIfSomeOneWins()) {
      this.canPlay = false
    }


  }

  //miniMax算法
  miniMax(alpha, beta, isMaximizing, availablePosition): number {
    if (this.checkIfSomeOneWins()) {
      let result = this.winner === 'AI' ? -10 : 10
      this.winner = undefined
      return result
    }
    if (availablePosition === 0)
      return 0
    if (isMaximizing) {
      let maxVal = -Infinity

      for (let [i, j] of this.ma) {
        if (this.grid[i][j] !== 0)
          continue
        this.grid[i][j] = 1
        let value = this.miniMax(alpha, beta, !isMaximizing, availablePosition - 1)

        maxVal = Math.max(maxVal, value)
        alpha = Math.max(alpha, maxVal)
        this.grid[i][j] = 0
        if (alpha >= beta)
          break
      }
      return maxVal
    } else {
      let minVal = Number.MAX_VALUE
      for (let [i, j] of this.ma) {
        if (this.grid[i][j] !== 0)
          continue
        this.grid[i][j] = 2
        let value = this.miniMax(alpha, beta, !isMaximizing,
          availablePosition - 1)

        minVal = Math.min(minVal, value)
        beta = Math.min(minVal, beta)
        this.grid[i][j] = 0
        if (beta < alpha)
          break
      }
      return minVal
    }
  }

  //判断是否有人赢了
  checkIfSomeOneWins(): boolean {
    //检查行
    for (let i = 0; i < 3; i++) {
      const x = this.grid[i][0]
      if (x === 0)
        continue
      let count = 0
      for (let j = 0; j < 3; j++) {
        if (this.grid[i][j] === x)
          count++
      }
      if (count === 3) {
        this.winner = x === 1 ? '玩家' : 'AI'
        return true
      }
    }
    //检查列
    for (let i = 0; i < 3; i++) {
      const x = this.grid[0][i]
      if (x === 0)
        continue
      let count = 0
      for (let j = 0; j < 3; j++) {
        if (this.grid[j][i] === x)
          count++
      }
      if (count === 3) {
        this.winner = x === 1 ? '玩家' : 'AI'
        return true
      }
    }

    //检查左上到右下对角线
    const zz = [[0, 0], [1, 1], [2, 2]]
    const yy = [[2, 0], [1, 1], [0, 2]]
    if (!zz.map(([x, y]) => this.grid[x][y])
      .some(x => x === 0 || x !== this.grid[0][0])) {
      this.winner = this.grid[0][0] === 1 ? '玩家' : 'AI'
      return true
    }
    if (!yy.map(([x, y]) => this.grid[x][y])
      .some(x => x === 0 || x !== this.grid[2][0])) {
      this.winner = this.grid[2][0] === 1 ? '玩家' : 'AI'
      return true
    }
    //如果都没有连成一线，返回false
    return false
  }

  //重置
  reset(): void {
    this.grid = Array.from(Array(3),
      () => Array<number>(3).fill(0))
    this.winner = undefined
    this.count = 9
    this.canPlay = true
  }

}
