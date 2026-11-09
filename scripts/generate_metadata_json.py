import json
import os

locale_meta = {
    'zh': {
        'title': 'Agency Agents',
        'description': '为 DeepSeek Harness 提供 331 名可召唤的专业智能体。',
        'detail': 'README.zh-CN.md'
    },
    'en': {
        'title': 'Agency Agents',
        'description': '331 summonable domain experts for DeepSeek Harness.',
        'detail': 'README.en.md'
    },
    'ja': {
        'title': 'Agency Agents',
        'description': 'DeepSeek Harness向けに召喚可能な331名のドメイン専門エージェントを提供。',
        'detail': 'README.ja.md'
    },
    'es': {
        'title': 'Agency Agents',
        'description': '331 agentes expertos invocables para DeepSeek Harness.',
        'detail': 'README.es.md'
    },
    'fr': {
        'title': 'Agency Agents',
        'description': '331 agents experts invocables pour DeepSeek Harness.',
        'detail': 'README.fr.md'
    },
    'de': {
        'title': 'Agency Agents',
        'description': '331 aufrufbare Fachexperten für DeepSeek Harness.',
        'detail': 'README.de.md'
    },
    'ru': {
        'title': 'Agency Agents',
        'description': '331 вызываемый профильный агент для DeepSeek Harness.',
        'detail': 'README.ru.md'
    },
    'pt': {
        'title': 'Agency Agents',
        'description': '331 agentes especialistas invocáveis para DeepSeek Harness.',
        'detail': 'README.pt.md'
    }
}

remote_meta = {
    'zh': {
        'title': 'Agency Agents 接口',
        'description': '供网关发现专家团与智能体的远程接口。'
    },
    'en': {
        'title': 'Agency Agents remote',
        'description': 'Remote entry the gateway uses to reach Agency Agents.'
    },
    'ja': {
        'title': 'Agency Agents リモート',
        'description': 'ゲートウェイがAgency Agentsにアクセスするためのリモートインターフェース。'
    },
    'es': {
        'title': 'Agency Agents remoto',
        'description': 'Interfaz remota que utiliza la puerta de enlace para acceder a Agency Agents.'
    },
    'fr': {
        'title': 'Agency Agents distant',
        'description': 'Interface distante utilisée par la passerelle pour accéder à Agency Agents.'
    },
    'de': {
        'title': 'Agency Agents Remote',
        'description': 'Remote-Schnittstelle für das Gateway zum Zugriff auf Agency Agents.'
    },
    'ru': {
        'title': 'Интерфейс Agency Agents',
        'description': 'Удаленный интерфейс шлюза для взаимодействия с Agency Agents.'
    },
    'pt': {
        'title': 'Agency Agents remoto',
        'description': 'Interface remota utilizada pelo gateway para aceder ao Agency Agents.'
    }
}

os.makedirs('locale/remote', exist_ok=True)

for lang, data in locale_meta.items():
    path = f'locale/{lang}.json'
    with open(path, 'w', encoding='utf-8') as f:
        json.dump({'meta': data}, f, ensure_ascii=False, indent=2)
    print(f"Wrote {path}")

for lang, data in remote_meta.items():
    path = f'locale/remote/{lang}.json'
    with open(path, 'w', encoding='utf-8') as f:
        json.dump({'meta': data}, f, ensure_ascii=False, indent=2)
    print(f"Wrote {path}")
