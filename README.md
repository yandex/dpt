# Packet manager for bem-based interface prototyping
## Installation
Before you need [Node.js with npm](https://nodejs.org/en/) installed on your system.
Then run command in Terminal.

```bash
npm install -g git+https://git@github.yandex-team.ru:serp-design/dpt.git
```

In case of error, run command with `sudo`. But better solution of the error is
to [change folder for global npm-modules](https://docs.npmjs.com/getting-started/fixing-npm-permissions).
```bash
sudo npm install -g git+https://git@github.yandex-team.ru:serp-design/dpt.git
```

## Use
If you want to create new project, you should init it first.
```bash
mkdir ~/Sites
cd ~/Sites
dpt new myproject
cd myproject
dpt start
```

`⌃+C`

To run Depot in existing project navigate to it's directory and run `dpt`.
```bash
cd ~/Sites/myproject
dpt
```



## Setting deployment process
```
http://%path-to-your-project%/git-api/pull-changes/  
```

## How to rebuild
_Если хотите исправить внутренний код dpt, например, стили css_

В терминале переходим в папку dpt `cd ~/your-path/dpt` и установливаем пакеты
```bash
npm install
```
Необходимо объединить между собой локальные папки с Депо и Dpt → в табе `cd ~/your-path/dpt` линкуем их:
```
sudo npm link
```
Для начала разработки запустим компилятор. **Обязательно** в разных табах в той же папке с **dpt** запускаем команды:
```bash
npm run babel -- --watch`
// компилирует весь новый JavaScript в совместимый со старым
```
```bash
npm run webpack -- --watch`
// собирает весь клиентский JavaScript в один файл
```
Теперь начинайте работать с **dpt**. К слову, все изменения кода вы сможете моментально наблюдать на localhost.

После всех работ с кодом завершите процессы компилятора из двух вкладок (это я про _babel_ и _webpack_) через **Ctrl+C**.

Время финальной сборки. Запускайте команды последовательно (можно в одном табе).
```
npm run babel
npm run webpack -- -p
```

Пора коммитить и пушить. Важный момент — обязательно разделяйте коммиты на группы. Все коммиты из папки build называйте `rebuild`. Остальный, например, из папки src называйте осмысленно. Таким образом обеспечивается более простая откатка.

Гигиенические процедуры. После пуша вам надо отлинковать депо от dpt. Для этого **в табе dpt** запускаем
```
sudo npm unlink
```
Связь будет разорвана и придётся заново установить само depot. Переходим в папку `~cd/your-path/depot`, останавливаем работу сервера и запускаем установку
```
npm install -g git+https://git@github.yandex-team.ru:serp-design/dpt.git
```
