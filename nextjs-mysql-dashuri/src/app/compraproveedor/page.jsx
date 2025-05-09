import comprarAproveedor from "@/components/ComprarAProveedor";

const Form2 = comprarAproveedor


function compraproveedor() {
	return (
		<div style={{
			display: 'flex',
			width: '100vw',	//100% ancho pantalla
			height: '100vh',	//100% alto pantalla
			border: '2px #CCA9DD',
			padding: '20px',
			backgroundColor: '#CCA9DD',
		}}> 
			<Form2 />
		</div>
	);
}

export default compraproveedor;