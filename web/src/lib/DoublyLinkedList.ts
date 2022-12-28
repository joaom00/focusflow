type Node<T> = {
  value: T
  prev?: Node<T>
  next?: Node<T>
}

export class DoublyLinkedList<T> {
  public length: number
  private head?: Node<T>
  private tail?: Node<T>

  constructor() {
    this.length = 0
    this.head = undefined
    this.tail = undefined
  }

  prepend(item: T): void {
    const node = { value: item } as Node<T>

    this.length++
    if (!this.head) {
      this.head = node
      return
    }

    node.next = this.head
    this.head.prev = node
    this.head = node
  }

  append(item: T): void {
    this.length++
    const node = { value: item } as Node<T>

    if (!this.tail) {
      this.head = this.tail = node
      return
    }

    node.prev = this.tail
    this.tail.next = node
    this.tail = node
  }

  getAt(index: number) : Node<T> | undefined {
    let curr = this.head
    for (let i = 0; curr && i < this.length; i++) {
      if (i === index) {
        return curr
      }
      curr = curr.next
    }
    return undefined
  }

  getLast(): Node<T> | undefined {
    return this.tail
  }
}
