import { css } from 'common/dom-utils';
import { BaseHTMLElement, customElement, elem, frag, onEvent, trigger } from 'dom-native';


@customElement('dg-dialog')
export class DgDialog extends BaseHTMLElement {

	constructor() {
		super();
		this.attachShadow({ mode: 'open' }).append(_renderShadow());
	}

	init() {
		const title = this.getAttribute('title');

		if (title) {
			this.innerHTML += `<div slot="title">${title}</div>`;
		}
	}

	//#region    ---------- Events ---------- 
	@onEvent('pointerup', '.do-close, .do-cancel')
	doCloseOrCancel() {
		this.cancel();
	}

	@onEvent('pointerup', '.do-ok')
	doOk() {
		trigger(this, 'OK');
		this.close();
	}
	//#endregion ---------- /Events ---------- 

	cancel() {
		trigger(this, 'CANCEL');
		this.close();
	}

	close() {
		this.remove();
		trigger(this, 'CLOSE');
	}
}



//// CSS
const _compCss = css`
	:host{
		position: absolute;
		z-index: 100;
		top: 0; left: 0; bottom: 0; right: 0;
		background: rgba(0,0,0,.3);
	}

	.dialog{
		position: absolute;
		width: 25rem;
		top: 50%;
		left: 50%;
		margin-left: -12.5rem;
		margin-top: -10rem;		
		background: #fff;
		display: grid;
		grid-template-rows: 3rem 1fr .5rem 2rem;
		grid-template-columns: 1rem 1fr 2rem;
		padding-bottom: 1rem;
		grid-gap: 1rem;
	}

	header{
		display: contents;
	}
	
	.title{
		align-self: center;
		grid-area: 1 / 2;		
	}
	
	/* style slot placehold as well */
	.title > *, .title > ::slotted(*){
		font-size: 1.2rem;
	}

	header c-ico{
		grid-area: 1 / 3;
		width: 1.5rem;
		height: 1.5rem;
		justify-self: center;
		align-self: center;
	}

	section{
		grid-area: 2 / 2;
	}
	footer{
		grid-area: 4 / 2;
		display: grid;
		grid-template-columns: 1fr auto auto;
		grid-gap: 1rem;
	}
`;


//// ShadowRoot render
let _compStyle: HTMLElement | undefined;
function _renderShadow() {

	const content = frag(`
<div class="dialog" part="dialog">
	<header>
		<div class="title"><slot name="title"></slot></div>
		<c-ico class="do-close" src="#ico-close"></c-ico>
	</header>
	<section>
		<slot></slot>
	</section>
	<span></span>
	<footer>
		<span></span>
		<slot name="footer"></slot>
	</footer>
</div>
`);

	// create style only once and reuse
	_compStyle ??= Object.assign(elem('style'), { innerHTML: _compCss });
	content.prepend(_compStyle.cloneNode(true));

	return content;
}

const ex = /*html*/`

<dg-dialog title="Some title">
	<div>some complex <input value="content"> </div>
</dg-dialog>


`

