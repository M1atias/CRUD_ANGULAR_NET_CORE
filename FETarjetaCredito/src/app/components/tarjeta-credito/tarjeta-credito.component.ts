import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { TarjetaService } from 'src/app/services/tarjeta.service';
//import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tarjeta-credito',
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent implements OnInit {

  listTarjetas:any[] = [];
  accion = 'Agregar';
  form: FormGroup;
  id:number | undefined;

  constructor( private fb: FormBuilder,
    private _tarjetaService : TarjetaService,
    //private toastr: ToastrService
    ) {
    this.form = this.fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: ['',[Validators.required, Validators.maxLength(16), Validators.minLength(16)]],
      fechaExpiracion: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
      cvv: ['',[Validators.required, Validators.maxLength(3), Validators.minLength(3)]]
    })
   }

  ngOnInit(): void {
    this.obtenerTarjetas()
  }

  obtenerTarjetas(){
    this._tarjetaService.getListTarjeta().subscribe(data =>{
      console.log(data)
      this.listTarjetas = data;
    }, error => {
      console.log(error)
    })
  }

  guardarTarjeta(){
    
    const tarjeta: any = {
      titular: this.form.get('titular')?.value,
      numeroTarjeta: this.form.get('numeroTarjeta')?.value,
      fechaExpiracion: this.form.get('fechaExpiracion')?.value,
      cvv: this.form.get('cvv')?.value,
    }

    if (this.id == undefined) {
      //Agregamos una tarjeta
      this._tarjetaService.saveTarjeta(tarjeta).subscribe(data=>{
        Notify.success('Tarjeta registrada !!!',{timeout:1000});
        this.form.reset();
        this.obtenerTarjetas();
        
      },error => {
        Notify.failure('Opss... ocurrio un error',{timeout:1000});
        console.log(error)
      })
    }else{
      tarjeta.id = this.id;
      //Editamos una tarjeta
      this._tarjetaService.updateTarjeta(this.id,tarjeta).subscribe(data =>{
        Notify.info(data.message,{timeout:1000});
        this.form.reset();
        this.accion = "Agregar";
        this.id = undefined;
        this.obtenerTarjetas();
      },error =>{
        console.log(error)
      })
    }

  }

  eliminarTarjeta(id:number){
    this._tarjetaService.deleteTarjeta(id).subscribe(data =>{
      Notify.failure(data.message,{timeout:1000});
      this.obtenerTarjetas();
      console.log(data)
    },error =>{
      console.log(error)
    })
  }

  editarTarjeta(tarjeta:any){
    this.accion = "Editar";
    this.id = tarjeta.id;

    this.form.patchValue({
      titular: tarjeta.titular,
      numeroTarjeta: tarjeta.numeroTarjeta,
      fechaExpiracion: tarjeta.fechaExpiracion,
      cvv: tarjeta.cvv
    })
  }

}
