import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TiposOcorrencia } from '@/constants/tiposOcorrencia';
import { Tema } from '@/theme';
import type { TipoOcorrencia } from '@/types/ocorrencia';

interface Props {
  valor?: TipoOcorrencia;
  onChange: (tipo: TipoOcorrencia) => void;
  erro?: string;
}

export function SeletorTipo({ valor, onChange, erro }: Props) {
  return (
    <View style={estilos.grupo}>
      <Text style={estilos.rotulo}>Categoria</Text>
      <View style={estilos.grade}>
        {(Object.keys(TiposOcorrencia) as TipoOcorrencia[]).map((tipo) => {
          const item = TiposOcorrencia[tipo];
          const ativo = valor === tipo;
          return (
            <Pressable
              key={tipo}
              onPress={() => onChange(tipo)}
              accessibilityRole="button"
              accessibilityState={{ selected: ativo }}
              style={[
                estilos.chip,
                ativo && { borderColor: item.cor, backgroundColor: `${item.cor}18` },
              ]}
            >
              <MaterialCommunityIcons
                name={item.icone as keyof typeof MaterialCommunityIcons.glyphMap}
                size={18}
                color={ativo ? item.cor : Tema.cores.textoSuave}
              />
              <Text style={[estilos.chipTexto, ativo && { color: item.cor }]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  grupo: {
    gap: Tema.espaco.sm,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: '600',
    color: Tema.cores.textoSuave,
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Tema.espaco.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: Tema.cores.borda,
    borderRadius: Tema.raio.pill,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Tema.cores.superficie,
  },
  chipTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: Tema.cores.textoSuave,
  },
  erro: {
    color: Tema.cores.erro,
    fontSize: 13,
  },
});
