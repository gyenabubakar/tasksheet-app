import Swal, { SweetAlertOptions } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const swal = <T = any>(options: SweetAlertOptions) => MySwal.fire<T>(options);

export default swal;
