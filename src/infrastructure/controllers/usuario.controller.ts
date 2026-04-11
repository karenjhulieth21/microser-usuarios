import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CrearUsuarioUseCase } from '../../application/use-cases/crear-usuario.use-case';
import { ActualizarUsuarioUseCase } from '../../application/use-cases/actualizar-usuario.use-case';
import { EliminarUsuarioUseCase } from '../../application/use-cases/eliminar-usuario.use-case';
import { ObtenerUsuarioUseCase } from '../../application/use-cases/obtener-usuario.use-case';
import { ListarUsuariosUseCase } from '../../application/use-cases/listar-usuarios.use-case';
import { CrearUsuarioDTO, ActualizarUsuarioDTO, UsuarioResponseDTO } from '../../application/dto/usuario.dto';
import { UsuarioMapper } from '../persistence/mappers/usuario.mapper';
import { UsuarioDomainException } from '../../domain/exceptions/usuario-domain-exception';

@Controller('usuarios')
export class UsuarioController {
  private mapper = new UsuarioMapper();

  constructor(
    private crearUsuarioUseCase: CrearUsuarioUseCase,
    private actualizarUsuarioUseCase: ActualizarUsuarioUseCase,
    private eliminarUsuarioUseCase: EliminarUsuarioUseCase,
    private obtenerUsuarioUseCase: ObtenerUsuarioUseCase,
    private listarUsuariosUseCase: ListarUsuariosUseCase,
  ) {}

  @Post()
  async crearUsuario(@Body() dto: CrearUsuarioDTO): Promise<{ id: string }> {
    try {
      const id = await this.crearUsuarioUseCase.execute(dto);
      return { id };
    } catch (error) {
      if (error instanceof UsuarioDomainException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  @Put(':id')
  async actualizarUsuario(@Param('id') id: string, @Body() dto: CrearUsuarioDTO): Promise<void> {
    try {
      await this.actualizarUsuarioUseCase.execute({
        id,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
      });
    } catch (error) {
      if (error instanceof UsuarioDomainException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  @Delete(':id')
  async eliminarUsuario(@Param('id') id: string): Promise<void> {
    try {
      await this.eliminarUsuarioUseCase.execute(id);
    } catch (error) {
      if (error instanceof UsuarioDomainException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  @Get(':id')
  async obtenerUsuario(@Param('id') id: string): Promise<UsuarioResponseDTO> {
    try {
      const usuario = await this.obtenerUsuarioUseCase.execute(id);
      return this.mapper.toDTO(usuario);
    } catch (error) {
      if (error instanceof UsuarioDomainException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }

  @Get()
  async listarUsuarios(): Promise<UsuarioResponseDTO[]> {
    const usuarios = await this.listarUsuariosUseCase.execute();
    return usuarios.map((usuario) => this.mapper.toDTO(usuario));
  }
}
