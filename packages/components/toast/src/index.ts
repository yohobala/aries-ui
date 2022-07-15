import { def } from '@vue/shared';
import { createApp, createVNode, render } from 'vue'
import { toastProps } from "./toast"
import constructor from './toast.vue'

var seed = 1;

var vm: any = null

function close(id = null) {
	if (id == null) {
		if (vm != null) {
			vm.component.props.close = true
		}
	}
	else {
		const dom: HTMLElement = document.getElementById(id) as HTMLElement
		(dom.parentNode as ParentNode).removeChild(dom);
	}
}

function destroy(){
	const toastContainers = document.getElementsByClassName("toast-container")
	const doms = Array.from(toastContainers)
	doms.map(dom =>{
		(dom.parentNode as ParentNode).removeChild(dom);
	})
}


function toast(options: any) {
	var id = 'toast_' + seed++;
	// 动态创建一个DOM容器
	const container = document.createElement('div')
	container.setAttribute('class', 'toast-container')
	container.setAttribute('id', id)
	document.body.appendChild(container)

	// 动态创建一个DOM容器
	vm = createVNode(constructor, { ...options })

	//挂载vm到body
	// render函数的参数
	// 参数一：表示需要渲染的内容（虚拟节点）
	// 参数二：表示渲染的目标位置（DOM元素）
	render(vm, container)

	vm.component.props.id = id
	return id
}

toast.close = close
toast.destroy = destroy
export const AriToast = toast
