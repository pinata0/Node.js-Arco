JavaScript 문법을 **기초 → 실전에서 자주 쓰는 순서**로 나열하면 이렇게 보면 돼.

1. **변수 선언**
   - `let`
   - `const`
   - `var`

2. **자료형**
   - `number`
   - `string`
   - `boolean`
   - `null`
   - `undefined`
   - `bigint`
   - `symbol`
   - `object`

3. **연산자**
   - 산술: `+ - * / % **`
   - 대입: `= += -= *= /=`
   - 비교: `=== !== > < >= <=`
   - 논리: `&& || !`
   - Nullish: `??`
   - Optional chaining: `?.`
   - 삼항 연산자: `조건 ? A : B`

4. **문자열**
   - `'...'`
   - `"..."`
   - 템플릿 리터럴: `` `Hello ${name}` ``

5. **조건문**
   - `if`
   - `else if`
   - `else`
   - `switch`
   - `case`
   - `default`

6. **반복문**
   - `for`
   - `while`
   - `do...while`
   - `for...of`
   - `for...in`
   - `break`
   - `continue`

7. **함수**
   - 함수 선언
     ```js
     function add(a, b) {
       return a + b;
     }
     ```
   - 함수 표현식
   - 화살표 함수
     ```js
     const add = (a, b) => a + b;
     ```
   - 기본 매개변수
   - 나머지 매개변수 `...args`

8. **배열**
   ```js
   const arr = [1, 2, 3];
   ```
   주요 메서드:
   - `push`
   - `pop`
   - `shift`
   - `unshift`
   - `slice`
   - `splice`
   - `includes`
   - `indexOf`
   - `find`
   - `findIndex`
   - `map`
   - `filter`
   - `reduce`
   - `forEach`
   - `some`
   - `every`
   - `sort`

9. **객체**
   ```js
   const user = {
     name: "Kim",
     age: 20
   };
   ```
   - `obj.key`
   - `obj["key"]`
   - 프로퍼티 추가/삭제
   - 계산된 프로퍼티
   - 메서드

10. **구조 분해 할당**
    ```js
    const { name, age } = user;
    const [a, b] = arr;
    ```

11. **Spread / Rest 문법**
    ```js
    const newArr = [...arr, 4];
    const newObj = { ...user, age: 21 };
    ```

12. **스코프**
    - 전역 스코프
    - 함수 스코프
    - 블록 스코프
    - lexical scope

13. **호이스팅**
    - `var`
    - 함수 선언
    - `let` / `const`의 TDZ

14. **클로저**
    ```js
    function outer() {
      let count = 0;

      return () => ++count;
    }
    ```

15. **콜백 함수**
    ```js
    setTimeout(() => {
      console.log("hello");
    }, 1000);
    ```

16. **고차 함수**
    - 함수를 인자로 전달
    - 함수를 반환
    - `map`, `filter`, `reduce`

17. **객체의 `this`**
    ```js
    const user = {
      name: "Kim",
      hello() {
        console.log(this.name);
      }
    };
    ```
    - 일반 함수의 `this`
    - 메서드의 `this`
    - 화살표 함수의 `this`
    - `call`
    - `apply`
    - `bind`

18. **프로토타입**
    - `prototype`
    - prototype chain
    - 상속

19. **클래스**
    ```js
    class User {
      constructor(name) {
        this.name = name;
      }

      hello() {
        console.log(this.name);
      }
    }
    ```
    - `constructor`
    - `extends`
    - `super`
    - `static`
    - private field `#field`

20. **예외 처리**
    ```js
    try {
    } catch (error) {
    } finally {
    }
    ```
    - `throw`
    - `Error`

21. **Promise**
    ```js
    const promise = new Promise((resolve, reject) => {
      resolve("done");
    });
    ```
    - `.then()`
    - `.catch()`
    - `.finally()`
    - `Promise.all()`
    - `Promise.allSettled()`
    - `Promise.race()`

22. **async / await**
    ```js
    async function loadData() {
      const result = await fetch(url);
    }
    ```

23. **모듈**
    ```js
    export function add() {}

    import { add } from "./math.js";
    ```
    - `export`
    - `export default`
    - `import`
    - dynamic `import()`

24. **JSON**
    ```js
    JSON.stringify(obj);
    JSON.parse(text);
    ```

25. **Set / Map**
    ```js
    const set = new Set();
    const map = new Map();
    ```

26. **Date**
    ```js
    const now = new Date();
    ```

27. **정규표현식**
    ```js
    const regex = /hello/i;
    ```

28. **브라우저 JavaScript라면 DOM**
    ```js
    document.querySelector()
    document.getElementById()
    ```
    - DOM 탐색
    - DOM 수정
    - 이벤트 처리
    - `addEventListener`

29. **Node.js에서 특히 알아야 할 문법/개념**
    - ES Module `import/export`
    - CommonJS `require/module.exports`
    - `process`
    - `Buffer`
    - 비동기 처리
    - 이벤트
    - 파일/네트워크 API

30. **요즘 코드에서 매우 자주 보이는 문법**
    ```js
    const name = user?.profile?.name ?? "Unknown";

    const { id, ...rest } = user;

    const result = items
      .filter(item => item.active)
      .map(item => item.name);
    ```

지금 **Express + Node.js 백엔드를 배우려는 목적**이라면 전부 똑같은 비중으로 공부할 필요는 없어. 우선순위로 치면 **변수 → 객체/배열 → 함수 → 구조분해/Spread → `map/filter` → 모듈 → Promise → async/await → 예외처리**까지 익히면 Express 공부를 바로 시작할 수 있어.