class Heap {
	#length;
	#data;
	#mode;

	constructor(maxSize = 15, mode = 'decreasing') {
		this.#data = new Array(maxSize);
		this.#length = 0;
		this.#mode = mode;
	};

	isEmpty() {
		return this.#length === 0;
	};

	isFull() {
		return this.#length === this.#data.length;
	};

	getSize() {
		return this.#length;
	};

	#goUpDecreasing(index) {
		const saveValue = this.#data[index];

		let currentIndex = index;
		let parentIndex = Math.floor((index - 1) / 2);

		while(currentIndex > 0 && saveValue > this.#data[parentIndex]) {
			this.#data[currentIndex] = this.#data[parentIndex];

			currentIndex = parentIndex;

			parentIndex = Math.floor((currentIndex - 1) / 2);
		}

		this.#data[currentIndex] = saveValue;
	};

	#goUpIncreasing(index) {
		const saveValue = this.#data[index];

		let currentIndex = index;
		let parentIndex = Math.floor((index - 1) / 2);

		while(currentIndex > 0 && saveValue < this.#data[parentIndex]) {
			this.#data[currentIndex] = this.#data[parentIndex];

			currentIndex = parentIndex;

			parentIndex = Math.floor((currentIndex - 1) / 2);
		}

		this.#data[currentIndex] = saveValue;
	};

	#goUp(index) {
		// Можно было бы оставить реализацию прям внутри этого метода
		// Но тогда пришлось бы делать сравнение мода прям в цикле, что будет тормозить выполнение излишним сравнением
		// Либо делать выше проверку мода (вне цикла), но тогда boilerplate code все также останется, как и при этой реализации
		// Просто этот вариант более наглядный
		// Кодогенерация решит эту проблему
		switch(this.#mode) {
			case 'decreasing':
				this.#goUpDecreasing(index);
			break;
			case 'increasing':
				this.#goUpIncreasing(index);
			break;
			default:
				throw new Error('Is not found mode heap...');
		}
	};

	#goDownDecreasing(index) {
		const saveValue = this.#data[index];

		let currentIndex = index;
		let largestIndex = null;

		let leftChildIndex = 2 * index + 1;
		let rightChildIndex = leftChildIndex + 1;

		while(currentIndex < (this.#length - 1) / 2) {
			if (rightChildIndex < this.#length && this.#data[leftChildIndex] < this.#data[rightChildIndex]) {
				largestIndex = rightChildIndex;

			} else {
				largestIndex = leftChildIndex;
			}

			if (saveValue >= this.#data[largestIndex]) {
				break;
			}

			this.#data[currentIndex] = this.#data[largestIndex];
			currentIndex = largestIndex;

			leftChildIndex = 2 * currentIndex + 1;
			rightChildIndex = leftChildIndex + 1;
		}

		this.#data[currentIndex] = saveValue;
	};

	#goDownIncreasing(index) {
		const saveValue = this.#data[index];

		let currentIndex = index;
		let smallerIndex = null;

		let leftChildIndex = 2 * index + 1;
		let rightChildIndex = leftChildIndex + 1;

		while(currentIndex < (this.#length - 1) / 2) {
			if (rightChildIndex < this.#length && this.#data[leftChildIndex] > this.#data[rightChildIndex]) {
				smallerIndex = rightChildIndex;

			} else {
				smallerIndex = leftChildIndex;
			}

			if (saveValue <= this.#data[smallerIndex]) {
				break;
			}

			this.#data[currentIndex] = this.#data[smallerIndex];
			currentIndex = smallerIndex;

			leftChildIndex = 2 * currentIndex + 1;
			rightChildIndex = leftChildIndex + 1;
		}

		this.#data[currentIndex] = saveValue;
	};

	#goDown(index) {
		// Аналогичная проблема, что и с методом #goUp(index)
		switch(this.#mode) {
			case 'decreasing':
				this.#goDownDecreasing(index);
			break;
			case 'increasing':
				this.#goDownIncreasing(index);
			break;
			default:
				throw new Error('Is not found mode heap...');
		}
	};

	insert(value) {
		if (this.isFull()) {
			throw new Error('Heap is full... Operation insert(value) is not supported.');
		}

		const i = this.#length;

		this.#data[i] = value;

		this.#goUp(i);

		this.#length++;

		return true;
	};

	remove() {
		if (this.isEmpty()) {
			throw new Error('Heap is empty... Operation remove() is not supported.');
		}

		const deleteElement = this.#data[0];

		this.#length--;

		this.#data[0] = this.#data[this.#length];

		this.#goDown(0);

		return deleteElement;
	};

	toss(value) {
		// Вы можете избрать другую тактику построения пирамиды
		// Вам потребуется использовать не insert(value), а метод toss(value), который просто добавляет элементы, не заботясь о сохранении правил пирамиды
		// После того, как вы закончите вставку, просто вызовите метод restoreHeap(), который восстановить условия пирамиды
		// На большом количестве вставок метод toss(value) + restoreHeap() будут более производительными, чем нативный insert(value)
		if (this.isFull()) {
			throw new Error('Heap is full... Operation toss(value) is not supported.');
		}

		this.#data[this.#length] = value;

		this.#length++;

		return true;
	};

	restoreHeap() {
		// Использует иную технологию восстановления условий пирамиды, чем insert(value)
		// Отсекает нижний ярус элементов, которые не имеют потомком, и использует свойство метода спуска вниз: что, применяя к корню метод спуска, у которого два потомка - это пирамиды, можно сделать одну большую пирамиду
		for (let x = Math.floor(this.#length / 2 - 1); x >= 0; x--) {
			this.#goDown(x);
		}
	};

	draw() {
		if (this.isEmpty()) {
			console.log(`Heap is empty... There is nothing to draw. Current length heap: ${this.#length}`);

		} else {
			const arr = [];

			const queue = [];

			let powerTwo = 2;

			while(powerTwo <= this.#length) {
				powerTwo = powerTwo * powerTwo;
			}

			queue.push({ leftB: 0, rightB: powerTwo, dep: 0 });

			for (let m = 0; m < this.#length; m++) {
				const { leftB, rightB, dep } = queue.shift();

				const val = this.#data[m];

				const mid = Math.floor((rightB + leftB) / 2);

				if (!arr[dep]) {
					arr[dep] = new Array(powerTwo).fill(' ');
				}

				arr[dep][mid] = val;

				queue.push({ leftB, rightB: mid, dep: dep + 1 });
				queue.push({ leftB: mid + 1, rightB, dep: dep + 1 });
			}

			for (let m = 0; m < arr.length; m++) {
				const a = arr[m];

				console.log(a.join(' '));
			}
		}
	};
};

const heap = new Heap(20, 'decreasing');

heap.toss(70);
heap.toss(40);
heap.toss(50);
heap.toss(20);
heap.toss(60);
heap.toss(100);
heap.toss(80);
heap.toss(30);
heap.toss(10);
heap.toss(90);
heap.toss(53);

heap.restoreHeap();

heap.draw();
