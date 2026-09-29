const reviewItems = [
  {
    id: "c-op", lang: "C", title: "정수 나눗셈 · 형 변환",
    prompt: "7 / 3과 (double)7 / 3의 결과 차이가 바로 떠오르나?",
    bullets: ["정수끼리 나누면 정수 나눗셈.", "피연산자 하나가 double이면 실수 나눗셈.", "캐스팅은 계산이 끝난 뒤가 아니라 계산 전에 타입을 바꿔야 의미가 있다."],
    code: 'int a = 7, b = 3;\nprintf("%d\\n", a / b);\nprintf("%.2f", (double)a / b);'
  },
  {
    id: "c-flow", lang: "C", title: "if · switch · 반복문",
    prompt: "continue와 switch fall-through를 설명 없이 추적할 수 있나?",
    bullets: ["for는 초기식 → 조건 → 본문 → 증감.", "continue는 현재 반복의 나머지만 건너뛴다.", "switch에서 break가 없으면 다음 case로 이어진다."],
    code: 'for (int i=0; i<5; i++) {\n  if (i==2) continue;\n  printf("%d ", i);\n}'
  },
  {
    id: "c-func", lang: "C", title: "함수 · 값 전달 · static",
    prompt: "함수 안에서 매개변수를 바꾸면 원본도 바뀐다고 착각하지 않나?",
    bullets: ["일반 인자는 값 복사(pass-by-value).", "원본 수정은 주소를 넘겨 포인터로 접근.", "static 지역 변수는 호출이 끝나도 값을 유지."],
    code: 'void f(int x) { x += 10; }\nint a = 3;\nf(a); // a는 그대로 3'
  },
  {
    id: "c-array", lang: "C", title: "배열 · decay · sizeof",
    prompt: "배열 이름이 언제 포인터처럼 바뀌고, sizeof가 언제 달라지는지 기억나나?",
    bullets: ["a[i]는 *(a+i)로 볼 수 있다.", "배열 이름은 많은 식에서 첫 원소 포인터로 decay.", "함수 매개변수 int a[]는 사실상 int *a."],
    code: 'int a[5] = {0};\nprintf("%zu", sizeof(a)); // 배열 전체 크기'
  },
  {
    id: "c-string", lang: "C", title: "문자열 · null 문자",
    prompt: 'char s[] = "abc"의 strlen과 sizeof를 바로 말할 수 있나?',
    bullets: ["C 문자열은 char 배열 + 끝의 \\0.", "strlen은 \\0 제외.", "sizeof(char 배열)는 저장공간 전체를 센다.", "문자열 비교는 == 대신 strcmp 계열."],
    code: 'char s[] = "abc";\nprintf("%zu %zu", strlen(s), sizeof(s));'
  },
  {
    id: "c-pointer", lang: "C", title: "포인터 기본",
    prompt: "&x, p, *p를 주소/값으로 분리해서 설명할 수 있나?",
    bullets: ["&x는 x의 주소.", "p에는 주소가 저장된다.", "*p는 그 주소에 저장된 값.", "*p를 바꾸면 원본 값이 바뀐다."],
    code: 'int x = 3;\nint *p = &x;\n*p += 2; // x == 5'
  },
  {
    id: "c-pointer-arith", lang: "C", title: "포인터 연산 · 증감",
    prompt: "*p++, (*p)++, *++p의 차이가 바로 보이나?",
    bullets: ["p+1은 자료형 한 칸 이동.", "*p++는 *(p++). 현재 값을 사용한 뒤 p 이동.", "(*p)++는 가리키는 값을 증가.", "*++p는 p를 먼저 이동 후 역참조."],
    code: 'int a[] = {10,20,30};\nint *p = a;\nprintf("%d ", *p++);\nprintf("%d", *p);'
  },
  {
    id: "c-struct", lang: "C", title: "구조체 · typedef · ->",
    prompt: "구조체 변수와 구조체 포인터의 멤버 접근이 바로 구분되나?",
    bullets: ["구조체 변수는 .", "구조체 포인터는 ->", "typedef는 타입 별칭, enum은 이름 있는 정수 상수."],
    code: 'typedef struct { int x, y; } Point;\nPoint a = {2,5};\nPoint *p = &a;\np->x += p->y;'
  },
  {
    id: "c-memory", lang: "C", title: "malloc · free",
    prompt: "동적 배열 n개를 할당하고 해제하는 최소 코드가 바로 나오나?",
    bullets: ["malloc은 바이트 수를 요청.", "할당 실패 가능성을 고려해 NULL 확인.", "사용 후 free.", "free 이후 같은 포인터 역참조 금지."],
    code: 'int *a = malloc(sizeof(int) * n);\nif (a == NULL) return 1;\n/* use */\nfree(a);'
  },
  {
    id: "c-recursion", lang: "C", title: "재귀",
    prompt: "재귀 코드를 보면 종료 조건과 한 단계 축소 규칙부터 찾나?",
    bullets: ["종료 조건(base case)을 먼저 확인.", "입력이 매 호출마다 종료 조건에 가까워지는지 확인.", "반환식은 호출 스택을 거꾸로 복원하며 추적."],
    code: 'int f(int n) {\n  if (n <= 1) return 1;\n  return n * f(n-1);\n}'
  },
  {
    id: "py-op", lang: "Python", title: "/ · // · % · range",
    prompt: "7//3, 7/3, range(1,7,2)의 결과를 바로 말할 수 있나?",
    bullets: ["/는 실수 나눗셈, //는 몫, %는 나머지.", "range의 stop은 포함되지 않는다.", "들여쓰기가 블록을 결정한다."],
    code: 'for i in range(1, 7, 2):\n    print(i, end=" ")'
  },
  {
    id: "py-slice", lang: "Python", title: "인덱싱 · 슬라이싱",
    prompt: "a[1:5:2], a[::-1]을 머릿속으로 추적할 수 있나?",
    bullets: ["slice는 start:stop:step.", "stop은 미포함.", "음수 인덱스 -1은 마지막.", "슬라이싱은 보통 새 객체를 만든다."],
    code: 'a = [0,1,2,3,4,5]\nprint(a[1:5:2])\nprint(a[::-1])'
  },
  {
    id: "py-alias", lang: "Python", title: "list aliasing",
    prompt: "b = a가 복사가 아니라는 걸 코드 상태로 설명할 수 있나?",
    bullets: ["list는 mutable.", "b = a는 같은 객체를 가리키는 별칭이 될 수 있다.", "한쪽에서 원본을 수정하면 다른 이름에서도 보인다."],
    code: 'a = [1, 2]\nb = a\nb.append(3)\nprint(a)'
  },
  {
    id: "py-copy", lang: "Python", title: "얕은 복사 · 중첩 mutable",
    prompt: "a.copy()를 했는데 내부 리스트가 같이 바뀌는 이유가 떠오르나?",
    bullets: ["a.copy(), a[:], list(a)는 얕은 복사.", "바깥 컨테이너는 새 객체지만 내부 객체 참조는 공유될 수 있다.", "중첩 구조에서 특히 주의."],
    code: 'a = [[1], [2]]\nb = a.copy()\nb[0].append(9)\nprint(a)'
  },
  {
    id: "py-containers", lang: "Python", title: "tuple · dict · set",
    prompt: "dict 순회와 set 연산을 바로 읽을 수 있나?",
    bullets: ["dict는 key-value, items()로 (key,value) 순회.", "set은 중복 없는 집합.", "| 합집합, & 교집합, - 차집합.", "set의 표시 순서에 의존하지 않는다."],
    code: 'for k, v in d.items():\n    print(k, v)\n\ncommon = a & b'
  },
  {
    id: "py-func", lang: "Python", title: "함수 · mutable 인자 · return",
    prompt: "함수 안에서 list를 수정하면 호출자 쪽에서도 바뀌는 이유가 보이나?",
    bullets: ["return이 없으면 None.", "mutable 객체를 함수 내부에서 수정하면 호출자 쪽에서도 보일 수 있다.", "*args는 tuple, **kwargs는 dict 형태로 받는다."],
    code: 'def f(xs):\n    xs[0] = 99\na = [1,2,3]\nf(a)'
  },
  {
    id: "py-scope", lang: "Python", title: "스코프 · global · nonlocal",
    prompt: "이름을 읽는 것과 재바인딩하는 걸 구분할 수 있나?",
    bullets: ["함수 내부에서는 지역 이름이 우선.", "global은 전역 이름 재바인딩.", "nonlocal은 바깥 함수의 지역 이름 재바인딩."],
    code: 'x = 1\ndef f():\n    global x\n    x = 2'
  },
  {
    id: "py-comprehension", lang: "Python", title: "컴프리헨션",
    prompt: "[expr for x in xs if cond]를 일반 for문으로 바로 풀어쓸 수 있나?",
    bullets: ["먼저 반복 대상을 보고.", "조건으로 걸러낸 뒤.", "표현식을 결과에 넣는다.", "중첩이면 실제 for문의 순서로 풀어 읽는다."],
    code: 'print([x * 2 for x in range(6) if x % 2 == 1])'
  },
  {
    id: "py-sort", lang: "Python", title: "sorted · sort · key",
    prompt: "sorted와 list.sort의 반환값 차이가 바로 떠오르나?",
    bullets: ["sorted(xs)는 새 리스트 반환.", "list.sort()는 원본 정렬 후 None.", "key=lambda x: ... 로 정렬 기준 지정."],
    code: 'a = [(1,3),(2,1),(3,2)]\nprint(sorted(a, key=lambda x: x[1]))'
  },
  {
    id: "py-class", lang: "Python", title: "클래스 최소선",
    prompt: "__init__, self, 인스턴스 속성을 추적할 수 있나?",
    bullets: ["__init__은 인스턴스 초기화.", "self.x는 인스턴스 상태.", "임용 빠른 복습에서는 복잡한 상속보다 상태 추적 우선."],
    code: 'class Counter:\n    def __init__(self, n): self.n = n\n    def inc(self): self.n += 1'
  }
];

const problems = [
  {id:"C01",lang:"C",kind:"predict",title:"정수 연산 · 형 변환",topic:"정수 나눗셈 / 캐스팅",prompt:"실행 전에 출력 두 줄을 예측하세요.",code:'int a = 7, b = 3;\nprintf("%d\\n", a / b);\nprintf("%.2f\\n", (double)a / b);',answer:"2\n2.33",explanation:"첫 줄은 정수 나눗셈. 둘째 줄은 나누기 전에 a가 double로 바뀌어 실수 나눗셈."},
  {id:"C02",lang:"C",kind:"predict",title:"for · continue",topic:"반복문 / continue",prompt:"출력 순서를 적으세요.",code:'for (int i = 0; i < 6; i++) {\n  if (i % 2 == 0) continue;\n  printf("%d ", i);\n}',answer:"1 3 5",explanation:"짝수에서는 continue로 printf를 건너뜁니다."},
  {id:"C03",lang:"C",kind:"predict",title:"switch · fall-through",topic:"switch / break",prompt:"출력을 예측하세요.",code:'int x = 2;\nswitch (x) {\ncase 1: printf("A"); break;\ncase 2: printf("B");\ncase 3: printf("C"); break;\ndefault: printf("D");\n}',answer:"BC",explanation:"case 2에서 break가 없어서 case 3까지 이어집니다."},
  {id:"C04",lang:"C",kind:"predict",title:"함수 · 값 전달",topic:"pass-by-value",prompt:"출력을 예측하세요.",code:'void add10(int x) { x += 10; }\nint main(void) {\n  int a = 5;\n  add10(a);\n  printf("%d", a);\n}',answer:"5",explanation:"x는 a의 복사본입니다."},
  {id:"C05",lang:"C",kind:"code",title:"배열 기본 작성",topic:"배열 입력 / 반복 / 초기값",prompt:"정수 n과 n개의 정수를 입력받아 최댓값을 출력하는 프로그램을 10줄 안팎으로 작성하세요.",sampleIn:"5\n3 8 2 9 1",sampleOut:"9",answer:"n 입력 → 첫 원소 또는 안전한 값으로 max 초기화 → 배열/반복으로 비교하며 갱신",explanation:"핵심은 입력, 반복, 초기값입니다."},
  {id:"C06",lang:"C",kind:"predict",title:"strlen · sizeof",topic:"문자열 / null 문자",prompt:"필요한 헤더는 포함됐다고 가정하고 출력을 예측하세요.",code:'char s[] = "hello";\nprintf("%zu %zu", strlen(s), sizeof(s));',answer:"5 6",explanation:"strlen은 null 문자 제외, sizeof 배열은 null 포함 6바이트."},
  {id:"C07",lang:"C",kind:"predict",title:"포인터 기본",topic:"주소 / 역참조",prompt:"출력을 예측하세요.",code:'int x = 4;\nint *p = &x;\n*p = *p + 3;\nprintf("%d", x);',answer:"7",explanation:"*p가 x 자체를 수정합니다."},
  {id:"C08",lang:"C",kind:"predict",title:"포인터 · 배열",topic:"pointer arithmetic / 배열 decay",prompt:"출력을 예측하세요.",code:'int a[] = {2, 4, 6, 8};\nint *p = a;\np += 2;\nprintf("%d %d", *p, *(p - 1));',answer:"6 4",explanation:"p는 a[2]를 가리킵니다."},
  {id:"C09",lang:"C",kind:"predict",title:"증감과 포인터",topic:"*p++ 해석",prompt:"출력을 예측하세요.",code:'int a[] = {10, 20, 30};\nint *p = a;\nprintf("%d ", *p++);\nprintf("%d", *p);',answer:"10 20",explanation:"*p++는 *(p++). 첫 값을 사용한 뒤 p가 다음 칸으로 이동합니다."},
  {id:"C10",lang:"C",kind:"code",title:"포인터로 원본 수정",topic:"주소 전달 / 포인터 매개변수",prompt:"두 정수 a, b의 값을 서로 바꾸는 swap 함수를 포인터를 사용해 작성하세요.",sampleIn:"3 7",sampleOut:"7 3",answer:"tmp = *a; *a = *b; *b = tmp 형태",explanation:"주소를 넘겨 원본을 수정해야 합니다."},
  {id:"C11",lang:"C",kind:"predict",title:"구조체 포인터",topic:". / ->",prompt:"출력을 예측하세요.",code:'typedef struct { int x; int y; } Point;\nPoint a = {2, 5};\nPoint *p = &a;\np->x += p->y;\nprintf("%d %d", a.x, a.y);',answer:"7 5",explanation:"p->x는 a.x입니다."},
  {id:"C12",lang:"C",kind:"code",title:"동적 메모리",topic:"malloc / sizeof / free",prompt:"n을 입력받고 n개의 정수를 동적 배열에 저장한 뒤 합계를 출력하세요. malloc과 free를 사용하세요.",sampleIn:"4\n10 20 30 40",sampleOut:"100",answer:"malloc(sizeof(int)*n) → 입력/합산 → free. NULL 확인까지 하면 더 좋음.",explanation:"할당 크기와 해제를 확인하세요."},
  {id:"C13",lang:"C",kind:"predict",title:"재귀",topic:"재귀 호출 / 종료 조건",prompt:"출력을 예측하세요.",code:'int f(int n) {\n  if (n <= 1) return 1;\n  return n * f(n - 1);\n}\nprintf("%d", f(4));',answer:"24",explanation:"4 × 3 × 2 × 1."},
  {id:"C14",lang:"C",kind:"code",title:"문자열 순회",topic:"char 배열 / null / 반복",prompt:"공백 없는 문자열 하나를 입력받아 문자 a의 개수를 출력하세요. strlen을 써도 되고 포인터로 순회해도 됩니다.",sampleIn:"banana",sampleOut:"3",answer:"\\0까지 순회하거나 strlen 길이만큼 반복하면서 'a'를 세기",explanation:"문자열 끝과 반복 범위를 확인하세요."},
  {id:"C15",lang:"C",kind:"predict",title:"연결리스트 감각",topic:"구조체 포인터 + next",prompt:"두 번째 printf까지 포함한 전체 출력을 예측하세요.",code:'typedef struct Node {\n  int data;\n  struct Node *next;\n} Node;\nNode a = {1, NULL};\nNode b = {2, NULL};\na.next = &b;\nNode *p = &a;\nprintf("%d ", p->data);\np = p->next;\nprintf("%d", p->data);',answer:"1 2",explanation:"p가 a에서 b로 이동합니다."},

  {id:"P01",lang:"Python",kind:"predict",title:"연산자",topic:"/ // %",prompt:"출력을 예측하세요.",code:'print(7 // 3, 7 / 3, 7 % 3)',answer:"2 2.3333333333333335 1",explanation:"//는 몫, /는 실수 나눗셈, %는 나머지."},
  {id:"P02",lang:"Python",kind:"predict",title:"range",topic:"stop 미포함 / step",prompt:"출력을 예측하세요.",code:'for i in range(1, 7, 2):\n    print(i, end=" ")',answer:"1 3 5",explanation:"stop 7은 포함되지 않습니다."},
  {id:"P03",lang:"Python",kind:"predict",title:"슬라이싱",topic:"slicing",prompt:"두 줄의 출력을 예측하세요.",code:'a = [0, 1, 2, 3, 4, 5]\nprint(a[1:5:2])\nprint(a[::-1])',answer:"[1, 3]\n[5, 4, 3, 2, 1, 0]",explanation:"start:stop:step. stop은 미포함입니다."},
  {id:"P04",lang:"Python",kind:"predict",title:"list aliasing",topic:"mutable / 같은 객체 참조",prompt:"출력을 예측하세요.",code:'a = [1, 2]\nb = a\nb.append(3)\nprint(a)',answer:"[1, 2, 3]",explanation:"a와 b가 같은 list 객체를 가리킵니다."},
  {id:"P05",lang:"Python",kind:"code",title:"기본 작성",topic:"input / split / map / 반복",prompt:"정수 n과 n개의 정수를 입력받아 짝수의 합을 출력하세요.",sampleIn:"5\n1 2 3 4 5",sampleOut:"6",answer:"map(int, input().split())로 읽고 짝수만 누적. 입력 형식에 맞게 n도 사용.",explanation:"입력과 반복의 기본입니다."},
  {id:"P06",lang:"Python",kind:"predict",title:"dict",topic:"dict 접근 / 수정",prompt:"출력을 예측하세요.",code:'d = {"a": 1, "b": 2}\nd["a"] += 3\nprint(d["a"] + d["b"])',answer:"6",explanation:'d["a"]가 4가 되고 +2.'},
  {id:"P07",lang:"Python",kind:"predict",title:"set",topic:"교집합 / 합집합",prompt:"출력하는 값의 원소를 적으세요. 표시 순서는 무시합니다.",code:'a = {1, 2, 3}\nb = {3, 4}\nprint(a & b)\nprint(a | b)',answer:"교집합 {3}\n합집합 {1, 2, 3, 4}",explanation:"&는 교집합, |는 합집합입니다."},
  {id:"P08",lang:"Python",kind:"predict",title:"함수 · mutable 인자",topic:"객체 참조 / 함수 인자",prompt:"출력을 예측하세요.",code:'def f(xs):\n    xs[0] = 99\na = [1, 2, 3]\nf(a)\nprint(a)',answer:"[99, 2, 3]",explanation:"함수가 같은 list 객체를 수정합니다."},
  {id:"P09",lang:"Python",kind:"predict",title:"함수 반환",topic:"return / None",prompt:"두 줄의 출력을 예측하세요.",code:'def f(x):\n    if x > 0:\n        return x * 2\nprint(f(3))\nprint(f(0))',answer:"6\nNone",explanation:"두 번째 호출은 명시적 return이 없습니다."},
  {id:"P10",lang:"Python",kind:"code",title:"문자열 빈도",topic:"dict counting / max",prompt:"문자열 하나를 입력받아 각 문자의 등장 횟수 중 가장 큰 값을 출력하세요. dict를 사용해도 됩니다.",sampleIn:"banana",sampleOut:"3",answer:"문자별 count를 dict에 누적하고 max(values)를 출력",explanation:"빈도 dict 또는 collections를 사용할 수 있습니다."},
  {id:"P11",lang:"Python",kind:"predict",title:"얕은 복사",topic:"shallow copy / 중첩 mutable",prompt:"출력을 예측하세요.",code:'a = [[1], [2]]\nb = a.copy()\nb[0].append(9)\nprint(a)',answer:"[[1, 9], [2]]",explanation:"바깥 list만 복사되고 내부 list는 공유됩니다."},
  {id:"P12",lang:"Python",kind:"predict",title:"sorted · key",topic:"key 함수",prompt:"출력을 예측하세요.",code:'a = [(1, 3), (2, 1), (3, 2)]\nprint(sorted(a, key=lambda x: x[1]))',answer:"[(2, 1), (3, 2), (1, 3)]",explanation:"두 번째 원소 기준 오름차순."},
  {id:"P13",lang:"Python",kind:"predict",title:"컴프리헨션",topic:"comprehension 순서",prompt:"출력을 예측하세요.",code:'print([x * 2 for x in range(6) if x % 2 == 1])',answer:"[2, 6, 10]",explanation:"홀수 1,3,5만 골라 두 배."},
  {id:"P14",lang:"Python",kind:"predict",title:"클래스 기본",topic:"self / 인스턴스 상태",prompt:"출력을 예측하세요.",code:'class Counter:\n    def __init__(self, n):\n        self.n = n\n    def inc(self):\n        self.n += 1\nc = Counter(3)\nc.inc()\nprint(c.n)',answer:"4",explanation:"inc가 인스턴스 속성 n을 수정합니다."},
  {id:"P15",lang:"Python",kind:"code",title:"컨테이너 조합",topic:"set / sorted / unpack 출력",prompt:"정수 리스트를 입력받아 중복을 제거한 뒤 오름차순으로 출력하세요.",sampleIn:"6\n3 1 3 2 2 5",sampleOut:"1 2 3 5",answer:"sorted(set(nums)) 후 print(*...) 형태",explanation:"중복 제거 + 정렬."}
];

const STORAGE_KEY = "imyongcode:v1";
const app = document.getElementById("app");
const toastEl = document.getElementById("toast");

const defaultState = {
  review: {},
  diagnostic: {},
  theme: "dark"
};

let state = loadState();
let ui = {
  route: "home",
  reviewLang: "C",
  diagLang: "C",
  diagIndex: 0,
  openReviews: new Set()
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {...defaultState, ...(saved || {})};
  } catch {
    return {...defaultState};
  }
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function esc(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function toast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toastEl.classList.remove("show"), 1600);
}
function pct(n, d) {
  return d ? Math.round((n / d) * 100) : 0;
}
function route(name) {
  ui.route = name;
  document.querySelectorAll(".nav-item").forEach(x => x.classList.toggle("active", x.dataset.route === name));
  render();
  window.scrollTo({top: 0, behavior: "smooth"});
}
function gradeLabel(value) {
  return value === "good" ? "바로 풀림" : value === "unsure" ? "헷갈림" : value === "bad" ? "틀림" : "미평가";
}
function reviewLabel(value) {
  return value === "known" ? "바로 앎" : value === "unsure" ? "애매" : value === "unknown" ? "모름" : "미평가";
}
function compilerUrl() {
  return "https://www.mycompiler.io/";
}

function render() {
  document.documentElement.dataset.theme = state.theme;
  if (ui.route === "home") renderHome();
  if (ui.route === "review") renderReview();
  if (ui.route === "diagnostic") renderDiagnostic();
  if (ui.route === "weak") renderWeak();
  app.focus({preventScroll:true});
}

function renderHome() {
  const reviewed = Object.keys(state.review).length;
  const graded = Object.values(state.diagnostic).filter(x => x.grade).length;
  const bad = Object.values(state.diagnostic).filter(x => x.grade === "bad").length;
  const unsure = Object.values(state.diagnostic).filter(x => x.grade === "unsure").length;

  app.innerHTML = `
    <div class="eyebrow">2–4 day recovery mode</div>
    <h1 class="page-title">읽는 복습 말고,<br>바로 판단하고 풀기.</h1>
    <p class="page-subtitle">문법은 10초 카드로 기억만 깨우고, 진단은 한 문제씩 종이로 추적합니다. 틀린 번호는 자동으로 모아서 다음 보강 범위를 만들 수 있습니다.</p>

    <section class="hero">
      <div class="card hero-card">
        <div class="eyebrow">recommended</div>
        <h2>C부터 빠르게 복구</h2>
        <p>포인터·배열·문자열·함수 인자를 우선 확인하고, 바로 C01~C15 진단으로 넘어갑니다.</p>
        <div class="hero-actions">
          <button class="btn primary" data-action="start-review" data-lang="C">C 10초 훑기</button>
          <button class="btn" data-action="start-diagnostic" data-lang="C">C 진단 바로 가기</button>
        </div>
        <div class="progress-wrap">
          <div class="progress-row"><span>전체 학습 진행</span><b>${pct(reviewed + graded, reviewItems.length + problems.length)}%</b></div>
          <div class="progress"><span style="width:${pct(reviewed + graded, reviewItems.length + problems.length)}%"></span></div>
        </div>
      </div>
      <div class="card stat-stack">
        <div class="stat"><small>10초 카드 판정</small><b>${reviewed}<span style="font-size:13px;color:var(--muted)"> / ${reviewItems.length}</span></b></div>
        <div class="stat"><small>진단 판정</small><b>${graded}<span style="font-size:13px;color:var(--muted)"> / ${problems.length}</span></b></div>
        <div class="stat"><small>다시 볼 문제</small><b>${bad + unsure}</b></div>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <div><h2>빠르게 쳐내는 순서</h2><p>각 단계가 끝나야 다음으로 넘어가는 방식이 아니라, 기억이 살아난 순간 바로 진단으로 이동합니다.</p></div>
      </div>
      <div class="quick-grid">
        <article class="quick-card" data-action="start-review" data-lang="C">
          <div class="lang">01 · C REVIEW</div><h3>포인터 중심 10초 훑기</h3>
          <p>카드를 펼치기 전에 질문만 보고 판단. 바로 알면 설명은 읽지 않고 넘깁니다.</p>
        </article>
        <article class="quick-card" data-action="start-diagnostic" data-lang="C">
          <div class="lang">02 · C DIAGNOSTIC</div><h3>C01~C15 한 문제씩</h3>
          <p>실행 전에 출력 예측. 작성형은 코드 작성 후 MyCompiler로 확인합니다.</p>
        </article>
        <article class="quick-card" data-action="start-review" data-lang="Python">
          <div class="lang">03 · PYTHON REVIEW</div><h3>참조·복사 중심 훑기</h3>
          <p>list aliasing, slicing, shallow copy, range, dict를 빠르게 복구합니다.</p>
        </article>
        <article class="quick-card" data-action="start-diagnostic" data-lang="Python">
          <div class="lang">04 · PYTHON DIAGNOSTIC</div><h3>P01~P15로 종료 판정</h3>
          <p>완벽하게 맞히는 것보다 왜 틀렸는지를 분리하는 게 목적입니다.</p>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><div><h2>현재 상태</h2><p>점수보다 약점 유형을 봅니다.</p></div></div>
      <div class="stat-grid">
        <div class="stat"><small>바로 풀림</small><b>${Object.values(state.diagnostic).filter(x => x.grade === "good").length}</b></div>
        <div class="stat"><small>헷갈림</small><b>${unsure}</b></div>
        <div class="stat"><small>틀림</small><b>${bad}</b></div>
        <div class="stat"><small>아직 안 푼 문제</small><b>${problems.length - graded}</b></div>
      </div>
    </section>
  `;
}

function renderReview() {
  const items = reviewItems.filter(x => x.lang === ui.reviewLang);
  const done = items.filter(x => state.review[x.id]).length;
  app.innerHTML = `
    <div class="eyebrow">10-second syntax scan</div>
    <h1 class="page-title">문법 빠른 훑기</h1>
    <p class="page-subtitle">질문만 보고 10초 안에 핵심이 떠오르면 <b>바로 앎</b>. 설명을 읽지 말고 다음 카드로 넘어가세요.</p>

    <div class="toolbar">
      <div class="segmented">
        <button data-action="review-lang" data-lang="C" class="${ui.reviewLang==="C"?"active":""}">C</button>
        <button data-action="review-lang" data-lang="Python" class="${ui.reviewLang==="Python"?"active":""}">Python</button>
      </div>
      <span style="color:var(--muted);font-size:12px">${done} / ${items.length} 판정 완료</span>
    </div>
    <div class="progress"><span style="width:${pct(done, items.length)}%"></span></div>

    <div class="review-list section">
      ${items.map(item => {
        const status = state.review[item.id];
        const open = ui.openReviews.has(item.id);
        return `
          <article class="review-card ${open ? "open" : ""}">
            <div class="review-head" data-action="toggle-review" data-id="${item.id}">
              <div>
                <div class="eyebrow"><span class="status-dot ${status ? "status-"+status : ""}"></span>${reviewLabel(status)}</div>
                <h3>${esc(item.title)}</h3>
                <div class="review-prompt">${esc(item.prompt)}</div>
              </div>
              <div style="color:var(--muted)">${open ? "−" : "+"}</div>
            </div>
            <div class="review-body">
              <ul>${item.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>
              <pre class="mini-code">${esc(item.code)}</pre>
              <div class="grade-row">
                <button class="btn slim good" data-action="grade-review" data-id="${item.id}" data-grade="known">1 · 바로 앎</button>
                <button class="btn slim warn" data-action="grade-review" data-id="${item.id}" data-grade="unsure">2 · 애매</button>
                <button class="btn slim bad" data-action="grade-review" data-id="${item.id}" data-grade="unknown">3 · 모름</button>
              </div>
            </div>
          </article>
        `;
      }).join("")}
    </div>

    <div class="section">
      <button class="btn primary" data-action="start-diagnostic" data-lang="${ui.reviewLang}">${ui.reviewLang} 진단으로 바로 넘어가기 →</button>
    </div>
  `;
}

function renderDiagnostic() {
  const list = problems.filter(x => x.lang === ui.diagLang);
  if (ui.diagIndex >= list.length) ui.diagIndex = list.length - 1;
  if (ui.diagIndex < 0) ui.diagIndex = 0;
  const p = list[ui.diagIndex];
  const saved = state.diagnostic[p.id] || {};
  const graded = list.filter(x => state.diagnostic[x.id]?.grade).length;

  app.innerHTML = `
    <div class="eyebrow">paper trace first</div>
    <h1 class="page-title">짧은 진단</h1>
    <p class="page-subtitle">컴파일러는 정답 확인용입니다. 먼저 출력이나 코드를 적고, 그다음 확인하세요.</p>

    <div class="toolbar">
      <div class="segmented">
        <button data-action="diag-lang" data-lang="C" class="${ui.diagLang==="C"?"active":""}">C01–C15</button>
        <button data-action="diag-lang" data-lang="Python" class="${ui.diagLang==="Python"?"active":""}">P01–P15</button>
      </div>
      <span style="color:var(--muted);font-size:12px">${graded} / 15 판정 완료</span>
    </div>

    <div class="diag-shell">
      <article class="panel problem-card">
        <div class="problem-meta">
          <strong style="color:var(--text);font-family:'JetBrains Mono',monospace">${p.id}</strong>
          <span class="badge ${p.kind}">${p.kind === "predict" ? "출력 추적" : "코드 작성"}</span>
          <span class="badge">${esc(p.topic)}</span>
        </div>
        <h2>${esc(p.title)}</h2>
        <div class="question">${esc(p.prompt)}</div>

        ${p.code ? `
          <div class="code-block">
            <div class="code-toolbar"><span>${p.lang.toLowerCase()}</span><button data-action="copy-given-code" data-id="${p.id}">코드 복사</button></div>
            <pre>${esc(p.code)}</pre>
          </div>
        ` : ""}

        ${p.sampleIn ? `
          <div class="sample-grid">
            <div class="sample"><strong>예시 입력</strong><pre>${esc(p.sampleIn)}</pre></div>
            <div class="sample"><strong>예시 출력</strong><pre>${esc(p.sampleOut)}</pre></div>
          </div>
        ` : ""}

        <div class="answer-box">
          <label>${p.kind === "predict" ? "내 예상 출력" : "내 코드"}</label>
          ${p.kind === "predict"
            ? `<textarea class="answer-input" rows="3" data-action="answer-input" data-id="${p.id}" placeholder="실행하기 전에 먼저 적기">${esc(saved.answer || "")}</textarea>`
            : `<textarea class="code-input" data-action="answer-input" data-id="${p.id}" placeholder="${p.lang === "C" ? "// C 코드 작성" : "# Python 코드 작성"}">${esc(saved.answer || "")}</textarea>`
          }
        </div>

        <div class="problem-actions">
          <button class="btn primary" data-action="reveal-answer" data-id="${p.id}">${saved.revealed ? "정답 기준 다시 보기" : "정답 비교"}</button>
          ${p.kind === "code" ? `<button class="btn" data-action="copy-my-code" data-id="${p.id}">내 코드 복사</button>` : ""}
          <a class="btn" href="${compilerUrl()}" target="_blank" rel="noreferrer">MyCompiler 열기 ↗</a>
        </div>

        <div class="reveal ${saved.revealed ? "show" : ""}" id="reveal-${p.id}">
          <strong>정답 / 기준</strong>
          <p><code style="white-space:pre-wrap">${esc(p.answer)}</code></p>
          <p>${esc(p.explanation)}</p>
        </div>

        <div class="grade-row">
          <button class="btn good ${saved.grade==="good"?"primary":""}" data-action="grade-problem" data-id="${p.id}" data-grade="good">1 · 바로 풀림</button>
          <button class="btn warn" data-action="grade-problem" data-id="${p.id}" data-grade="unsure">2 · 헷갈림</button>
          <button class="btn bad" data-action="grade-problem" data-id="${p.id}" data-grade="bad">3 · 틀림</button>
        </div>

        <div class="problem-actions" style="justify-content:space-between;margin-top:22px">
          <button class="btn" data-action="prev-problem" ${ui.diagIndex===0?"disabled":""}>← 이전</button>
          <button class="btn primary" data-action="next-problem" ${ui.diagIndex===list.length-1?"disabled":""}>다음 →</button>
        </div>
      </article>

      <aside class="problem-nav">
        <h3>${ui.diagLang} 진단</h3>
        <div class="problem-dots">
          ${list.map((x, i) => {
            const g = state.diagnostic[x.id]?.grade;
            return `<button class="problem-dot ${i===ui.diagIndex?"current":""} ${g||""}" data-action="jump-problem" data-index="${i}" title="${x.id} · ${gradeLabel(g)}">${x.id.replace(/[A-Z]/g,"")}</button>`;
          }).join("")}
        </div>
        <div class="problem-side-actions">
          <button class="btn slim" data-action="jump-first-ungraded">첫 미평가 문제</button>
          <button class="btn slim" data-route="weak">약점만 보기</button>
        </div>
        <p style="font-size:11px;color:var(--muted);line-height:1.6;margin:12px 0 0">단축키: <kbd>1</kbd> 바로 풀림 · <kbd>2</kbd> 헷갈림 · <kbd>3</kbd> 틀림 · <kbd>←</kbd><kbd>→</kbd> 이동</p>
      </aside>
    </div>
  `;
}

function weakData() {
  const bad = problems.filter(p => state.diagnostic[p.id]?.grade === "bad");
  const unsure = problems.filter(p => state.diagnostic[p.id]?.grade === "unsure");
  const reviewUnknown = reviewItems.filter(x => state.review[x.id] === "unknown");
  const reviewUnsure = reviewItems.filter(x => state.review[x.id] === "unsure");
  return {bad, unsure, reviewUnknown, reviewUnsure};
}

function buildPrompt() {
  const {bad, unsure, reviewUnknown, reviewUnsure} = weakData();
  const lines = [
    `틀린 문제: ${bad.map(x=>x.id).join(", ") || "없음"}`,
    `헷갈렸지만 맞힌/애매한 문제: ${unsure.map(x=>x.id).join(", ") || "없음"}`,
    `빠른 훑기에서 모름: ${reviewUnknown.map(x=>x.title).join(", ") || "없음"}`,
    `빠른 훑기에서 애매: ${reviewUnsure.map(x=>x.title).join(", ") || "없음"}`,
    "",
    "요청: 위 결과 기준으로 약한 문법만 30~40분짜리 복습 자료로 설명하고, 같은 약점을 확인하는 추가 진단 8문제를 만들어줘. 이미 아는 부분은 반복하지 말고, 실행 전에 종이로 추적하는 방식으로 구성해줘."
  ];
  return lines.join("\n");
}

function renderWeak() {
  const {bad, unsure, reviewUnknown, reviewUnsure} = weakData();
  const total = bad.length + unsure.length + reviewUnknown.length + reviewUnsure.length;
  const prompt = buildPrompt();

  app.innerHTML = `
    <div class="eyebrow">weakness map</div>
    <h1 class="page-title">약점만 남기기</h1>
    <p class="page-subtitle">여기가 실제 복습 목록입니다. 맞힌 내용은 다시 정리하지 않고, 틀림/애매만 다음 세션으로 넘깁니다.</p>

    ${total === 0 ? `
      <div class="empty section">
        아직 기록된 약점이 없습니다.<br>
        <button class="btn primary" style="margin-top:14px" data-route="diagnostic">진단 시작하기</button>
      </div>
    ` : `
      <div class="weak-grid section">
        <div class="weak-card">
          <h3>틀린 문제 · ${bad.length}</h3>
          ${bad.length ? `<ul>${bad.map(x=>`<li><b>${x.id}</b> · ${esc(x.topic)}</li>`).join("")}</ul>` : '<p style="color:var(--muted)">없음</p>'}
        </div>
        <div class="weak-card">
          <h3>헷갈린 문제 · ${unsure.length}</h3>
          ${unsure.length ? `<ul>${unsure.map(x=>`<li><b>${x.id}</b> · ${esc(x.topic)}</li>`).join("")}</ul>` : '<p style="color:var(--muted)">없음</p>'}
        </div>
        <div class="weak-card">
          <h3>훑기에서 모름 · ${reviewUnknown.length}</h3>
          ${reviewUnknown.length ? `<ul>${reviewUnknown.map(x=>`<li>${esc(x.lang)} · ${esc(x.title)}</li>`).join("")}</ul>` : '<p style="color:var(--muted)">없음</p>'}
        </div>
        <div class="weak-card">
          <h3>훑기에서 애매 · ${reviewUnsure.length}</h3>
          ${reviewUnsure.length ? `<ul>${reviewUnsure.map(x=>`<li>${esc(x.lang)} · ${esc(x.title)}</li>`).join("")}</ul>` : '<p style="color:var(--muted)">없음</p>'}
        </div>
      </div>

      <div class="prompt-box">
        <div class="section-head">
          <div><h2>ChatGPT에 그대로 보내기</h2><p>번호와 약점 범위가 자동으로 정리됩니다.</p></div>
          <button class="btn slim primary" data-action="copy-prompt">프롬프트 복사</button>
        </div>
        <textarea id="weakPrompt" readonly>${esc(prompt)}</textarea>
      </div>
    `}

    <div class="section">
      <button class="btn bad" data-action="reset-all">모든 기록 초기화</button>
    </div>
  `;
}

document.addEventListener("click", async (e) => {
  const routeBtn = e.target.closest("[data-route]");
  if (routeBtn) {
    route(routeBtn.dataset.route);
    return;
  }

  const el = e.target.closest("[data-action]");
  if (!el) return;
  const action = el.dataset.action;

  if (action === "start-review") {
    ui.reviewLang = el.dataset.lang;
    route("review");
  }
  if (action === "start-diagnostic") {
    ui.diagLang = el.dataset.lang;
    const list = problems.filter(x => x.lang === ui.diagLang);
    const first = list.findIndex(x => !state.diagnostic[x.id]?.grade);
    ui.diagIndex = first >= 0 ? first : 0;
    route("diagnostic");
  }
  if (action === "review-lang") {
    ui.reviewLang = el.dataset.lang;
    renderReview();
  }
  if (action === "toggle-review") {
    const id = el.dataset.id;
    if (ui.openReviews.has(id)) ui.openReviews.delete(id);
    else ui.openReviews.add(id);
    renderReview();
  }
  if (action === "grade-review") {
    state.review[el.dataset.id] = el.dataset.grade;
    saveState();
    ui.openReviews.delete(el.dataset.id);
    renderReview();
  }
  if (action === "diag-lang") {
    ui.diagLang = el.dataset.lang;
    const list = problems.filter(x => x.lang === ui.diagLang);
    const first = list.findIndex(x => !state.diagnostic[x.id]?.grade);
    ui.diagIndex = first >= 0 ? first : 0;
    renderDiagnostic();
  }
  if (action === "jump-problem") {
    ui.diagIndex = Number(el.dataset.index);
    renderDiagnostic();
  }
  if (action === "prev-problem") {
    ui.diagIndex = Math.max(0, ui.diagIndex - 1);
    renderDiagnostic();
  }
  if (action === "next-problem") {
    const list = problems.filter(x => x.lang === ui.diagLang);
    ui.diagIndex = Math.min(list.length - 1, ui.diagIndex + 1);
    renderDiagnostic();
  }
  if (action === "jump-first-ungraded") {
    const list = problems.filter(x => x.lang === ui.diagLang);
    const first = list.findIndex(x => !state.diagnostic[x.id]?.grade);
    ui.diagIndex = first >= 0 ? first : 0;
    renderDiagnostic();
  }
  if (action === "reveal-answer") {
    const id = el.dataset.id;
    state.diagnostic[id] = {...(state.diagnostic[id] || {}), revealed: true};
    saveState();
    const box = document.getElementById(`reveal-${id}`);
    box?.classList.add("show");
    el.textContent = "정답 기준 다시 보기";
  }
  if (action === "grade-problem") {
    const id = el.dataset.id;
    state.diagnostic[id] = {...(state.diagnostic[id] || {}), grade: el.dataset.grade};
    saveState();
    const list = problems.filter(x => x.lang === ui.diagLang);
    if (ui.diagIndex < list.length - 1) ui.diagIndex += 1;
    renderDiagnostic();
  }
  if (action === "copy-given-code") {
    const p = problems.find(x => x.id === el.dataset.id);
    await navigator.clipboard.writeText(p?.code || "");
    toast("문제 코드를 복사했습니다");
  }
  if (action === "copy-my-code") {
    const value = state.diagnostic[el.dataset.id]?.answer || "";
    await navigator.clipboard.writeText(value);
    toast("내 코드를 복사했습니다");
  }
  if (action === "copy-prompt") {
    await navigator.clipboard.writeText(buildPrompt());
    toast("약점 프롬프트를 복사했습니다");
  }
  if (action === "reset-all") {
    if (confirm("빠른 훑기와 진단 기록을 전부 초기화할까요?")) {
      state = {...defaultState, theme: state.theme};
      saveState();
      renderWeak();
      toast("학습 기록을 초기화했습니다");
    }
  }
});

document.addEventListener("input", (e) => {
  const el = e.target.closest('[data-action="answer-input"]');
  if (!el) return;
  const id = el.dataset.id;
  state.diagnostic[id] = {...(state.diagnostic[id] || {}), answer: el.value};
  saveState();
});

document.querySelectorAll("[data-route]").forEach(el => {
  if (!el.dataset.action) {
    el.addEventListener("click", () => route(el.dataset.route));
  }
});

document.getElementById("themeToggle").addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  saveState();
  render();
});

document.addEventListener("keydown", (e) => {
  const tag = document.activeElement?.tagName;
  const typing = tag === "INPUT" || tag === "TEXTAREA";
  if (typing || ui.route !== "diagnostic") return;
  const list = problems.filter(x => x.lang === ui.diagLang);
  const p = list[ui.diagIndex];
  if (!p) return;

  if (["1","2","3"].includes(e.key)) {
    const map = {"1":"good","2":"unsure","3":"bad"};
    state.diagnostic[p.id] = {...(state.diagnostic[p.id] || {}), grade: map[e.key]};
    saveState();
    if (ui.diagIndex < list.length - 1) ui.diagIndex += 1;
    renderDiagnostic();
  }
  if (e.key === "ArrowLeft") {
    ui.diagIndex = Math.max(0, ui.diagIndex - 1);
    renderDiagnostic();
  }
  if (e.key === "ArrowRight") {
    ui.diagIndex = Math.min(list.length - 1, ui.diagIndex + 1);
    renderDiagnostic();
  }
});

render();
