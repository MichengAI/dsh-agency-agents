import os

def generate_regional_readmes():
    configs = {
        'ja': {
            'filename': 'README.ja.md',
            'banner': 'assets/branding/dsh-banner.webp',
            'tagline': '**331名の専門エージェント · 5つの組み込み専門家チーム · カスタム協調**',
            'nav_roster': '専門家一覧',
            'nav_install': 'インストール',
            'nav_changelog': '更新履歴',
            'badge_license': 'ライセンス: Apache-2.0',
            'badge_agents': '内蔵エージェント-331',
            'badge_downloads': 'npm ダウンロード数',
            'badge_supported': 'DSH サポート 0.2.2--rc.1 まで',
            'disclaimer': '> **免責事項**：DSH Agency Agents はコミュニティによって保守されている DeepSeek Harness（DSH）向けプラグインであり、DeepSeek AI 公式の製品ではありません。',
            'features_title': '機能の概要',
            'features_intro': 'コードレビュー、デザイン、運用、研究などのタスクにおいて、DSH で適切な専門家を選択することで、専門的な視点から業務を支援します。331名の専門家を内蔵し、インストール後すぐに利用可能です。',
            'features': [
                '**マルチサーフェス＆デュアルエントリ**：「設定 → エキスパート」モーダル管理をサポートするほか、プラグイン詳細ページでメインナビゲーションバー常駐の「エキスパート」フルパネル（960px 中央配置、モーダルのスクロール制約を完全解消）を有効化可能。',
                '**自然言語対話作成（Create with AI）**：新規エキスパートおよびチーム作成で「対話で作成」デュアルエントリをサポート。メインチャットへ自動ジャンプしてプロンプトを事前入力し、対話内で構造化プレビューを出力。複数ターンの微調整後、ホストのネイティブ Ask カード確認を経て編集フォームへ安全に反映（Human-in-the-Loop）。',
                '**スマート一括操作（Batch Actions）**：管理フィルターバー右側にネイティブなコンパクト一括メニューを搭載。ソース、カテゴリー、ステータス、キーワード検索と動的に連動し、「フィルター結果を有効化 (N) / 無効化 (M)」「すべて有効化 (331) / すべて無効化」を適応提供。二重確認とアトミックスケジューリングで保護。',
                '**331名の全領域専門家名簿**：エンジニアリング、デザイン、プロダクト、マーケティング、法務、財務など22の標準部門を網羅し、瞬時のプレフィックス検索に対応。',
                '**専門家チーム（Teams）複数役割協調**：5つの高頻度ビジネスクリティカルチームを内蔵し、最大100個のカスタムチーム作成に対応。タスクの複雑さに応じてリレー推進、並列実行、深層レビューの協調モードを自動選択。',
                '**チャット入力欄からのクイック呼び出し**：入力欄左側のロボットアイコンからすばやく選択するか、本文に `@` を入力して専門家およびチーム名簿を瞬時に呼び出し、タスク例をシームレスに入力。',
                '**エンタープライズ構成とセキュリティ防御**：プラグイン詳細ページでエントリ表示位置やスマート推薦を個別に設定可能。静的設定 `updater: false` によるプラットフォームレベルのロックをサポート。API は同一生成元と Content-Type 防御に完全対応。',
                '**リバースプロキシ配置の完全互換**：ページのベースアドレス（`document.baseURI`）に対して API エンドポイントを自動解決し、パスプレフィックスを除去するリバースプロキシ環境（`/app/dsh/` など）でも無損失で動作。'
            ],
            'teams_title': '専門家チーム (Expert Teams)',
            'teams_intro': '「設定 → エキスパート → 専門家チーム」でチームを管理します。単一専門家ページと共通のヘッダー、フィルター、検索およびカード操作を提供します。5つの組み込みチームは以下のシナリオをカバーします：',
            'team_col_name': '専門家チーム',
            'team_col_focus': '分析の重点',
            'team_col_delivery': '成果物',
            'teams': [
                ('プロダクト方案レビュー団', '要件の価値、ユーザー体験、技術的実現可能性', '優先順位とアクションリスト'),
                ('技術アーキテクチャレビュー団', 'アーキテクチャ、セキュリティ、受入境界', 'リスクと受入チェックリスト'),
                ('コンテンツ企画レビュー団', '企画の視点、拡散戦略、ファクトチェック', '企画案とコンテンツ構造'),
                ('データ分析診断団', '指標体系、データ品質、ビジネス解釈', '分析結論と検証ステップ'),
                ('テーマ研究専門家団', '研究範囲、論拠・証拠、総合判断', '情報源に基づく研究結論')
            ],
            'team_usage_title': '構成と使用法',
            'team_usage_steps': [
                '組み込みチームをそのまま利用するか、複製して編集します。2〜8名のメンバーからなるカスタムチームを新規作成することも可能（最大100個まで保存）。',
                '入力欄の `@` メニューでチームを選択すると、タスク要件のサンプルが自動挿入されます。送信前に要件を直接微調整できます。',
                'ホストが Agent Team サービスを有効にしている場合、自律的な並列協調モードが自動的に適用されます。'
            ],
            'install_title': 'クイックインストール',
            'install_cmd_web': 'dsh plugin --profile web add @michengai/dsh-agency-agents',
            'install_cmd_desktop': 'dsh plugin --profile desktop add @michengai/dsh-agency-agents',
            'divisions_title': '専門家カテゴリー (22 Divisions)',
        },
        'es': {
            'filename': 'README.es.md',
            'banner': 'assets/branding/dsh-banner-en.webp',
            'tagline': '**331 especialistas · 5 equipos integrados · Colaboración personalizada**',
            'nav_roster': 'Lista de expertos',
            'nav_install': 'Instalación',
            'nav_changelog': 'Historial de cambios',
            'badge_license': 'Licencia: Apache-2.0',
            'badge_agents': 'Agentes integrados-331',
            'badge_downloads': 'Descargas npm',
            'badge_supported': 'DSH compatible hasta 0.2.2--rc.1',
            'disclaimer': '> **Descargo de responsabilidad**: DSH Agency Agents es un complemento mantenido por la comunidad para DeepSeek Harness (DSH), no es un producto oficial de DeepSeek AI.',
            'features_title': 'Descripción general',
            'features_intro': 'Cuando enfrente tareas de revisión de código, diseño, operaciones o investigación, elija un especialista adecuado en DSH para que le ayude profesionalmente. Incluye 331 expertos listos para usar tras la instalación.',
            'features': [
                '**Acceso multisurface y diseño amplio**: Gestione desde **Configuración → Expertos** o active la entrada fija en la barra lateral para abrir en un panel centrado dedicado de 960px sin límites de desplazamiento.',
                '**Creación mediante IA (Create with AI)**: Flujo de creación dual con salto directo al chat principal y prellenado de prompts. Previsualizaciones en Markdown estructurado con ajuste en múltiples turnos y confirmación nativa Ask (Human-in-the-Loop).',
                '**Acciones inteligentes por lotes**: Menú compacto en la barra de filtros vinculado dinámicamente: «Habilitar filtrados (N) / Deshabilitar filtrados (M)» y «Habilitar todos (331) / Deshabilitar todos», con confirmación y ejecución atómica.',
                '**Catálogo completo de 331 expertos de dominio**: Cubre 22 divisiones estándar (ingeniería, producto, diseño, marketing, legal, etc.) con búsqueda instantánea.',
                '**Colaboración en equipo multirrol (Teams)**: 5 equipos integrados de alto impacto y soporte para hasta 100 equipos personalizados con ejecución paralela o relevo.',
                '**Invocación rápida en el editor**: Convoque especialistas o equipos mediante `@` o el botón de robot junto al campo de entrada.',
                '**Control empresarial y seguridad**: Configure ubicaciones de entrada y sugerencias inteligentes; compatible con `updater: false` para bloqueo estricto de plataforma y validación de origen.',
                '**Compatibilidad con proxies inversos**: Resolución automática de URL base (`document.baseURI`) para operar detrás de proxies que eliminan prefijos de ruta.'
            ],
            'teams_title': 'Equipos de expertos (Expert Teams)',
            'teams_intro': 'Gestione equipos en «Configuración → Expertos → Equipos de expertos», compartiendo encabezado, filtros y búsqueda. Los cinco equipos cubren los siguientes escenarios:',
            'team_col_name': 'Equipo de expertos',
            'team_col_focus': 'Enfoque de análisis',
            'team_col_delivery': 'Livrables',
            'teams': [
                ('Equipo de revisión de producto', 'Valor de requisitos, experiencia de usuario, viabilidad técnica', 'Prioridades y lista de acciones'),
                ('Equipo de revisión técnica', 'Arquitectura, seguridad, límites de aceptación', 'Riesgos y lista de verificación'),
                ('Equipo de planificación de contenidos', 'Ángulo editorial, estrategia de difusión, verificación de hechos', 'Propuesta editorial y estructura'),
                ('Equipo de diagnóstico y análisis de datos', 'Métricas, calidad de datos, interpretación de negocio', 'Conclusiones y pasos de validación'),
                ('Equipo de investigación especializada', 'Alcance, evidencias, juicio sintético', 'Conclusiones respaldadas con fuentes')
            ],
            'team_usage_title': 'Configuración y uso',
            'team_usage_steps': [
                'Use un equipo integrado directamente o cópielo para personalizarlo. Cree equipos de 2 a 8 miembros (hasta 100 guardados).',
                'Seleccione un equipo con `@` en el editor para insertar automáticamente ejemplos de tareas antes de enviar.',
                'Si el host tiene habilitado Agent Team, se aplicará automáticamente el modo de colaboración nativo.'
            ],
            'install_title': 'Instalación rápida',
            'install_cmd_web': 'dsh plugin --profile web add @michengai/dsh-agency-agents',
            'install_cmd_desktop': 'dsh plugin --profile desktop add @michengai/dsh-agency-agents',
            'divisions_title': 'Divisiones de expertos (22 Divisions)',
        },
        'fr': {
            'filename': 'README.fr.md',
            'banner': 'assets/branding/dsh-banner-en.webp',
            'tagline': '**331 spécialistes · 5 équipes intégrées · Collaboration sur mesure**',
            'nav_roster': 'Liste des experts',
            'nav_install': 'Installation',
            'nav_changelog': 'Journal des modifications',
            'badge_license': 'Licence: Apache-2.0',
            'badge_agents': 'Agents intégrés-331',
            'badge_downloads': 'Téléchargements npm',
            'badge_supported': 'DSH supporté jusqu’à 0.2.2--rc.1',
            'disclaimer': '> **Avertissement** : DSH Agency Agents est un plugin maintenu par la communauté pour DeepSeek Harness (DSH) et n’est pas un produit officiel de DeepSeek AI.',
            'features_title': 'Aperçu des fonctionnalités',
            'features_intro': 'Pour la revue de code, le design, les opérations ou la recherche, choisissez un spécialiste dans DSH pour vous assister avec expertise. 331 experts sont intégrés et prêts à l’emploi après installation.',
            'features': [
                '**Accès multi-surfaces et affichage large** : Accédez depuis **Paramètres → Experts** ou activez l’entrée latérale permanente pour ouvrir un panneau dédié de 960px centré.',
                '**Création assistée par IA (Create with AI)** : Création en dialogue avec redirection vers le chat principal et pré-remplissage des prompts. Aperçus Markdown interactifs et confirmation native Ask (Human-in-the-Loop).',
                '**Actions groupées intelligentes** : Menu compact dans la barre de filtre avec synchronisation dynamique : « Activer filtrés (N) / Désactiver filtrés (M) » et « Tout activer (331) / Tout désactiver » avec exécution atomique.',
                '**Répertoire complet de 331 experts métier** : Couvre 22 divisions standards (ingénierie, produit, design, marketing, juridique, etc.) avec recherche instantanée.',
                '**Collaboration d’équipe multi-rôles (Teams)** : 5 équipes expertes intégrées et création de jusqu’à 100 équipes personnalisées en parallèle ou en relais.',
                '**Invocation rapide dans l’éditeur** : Convoquez des spécialistes ou des équipes avec le déclencheur `@` ou le bouton robot à côté du champ de saisie.',
                '**Sécurité et contrôle d’entreprise** : Personnalisez l’emplacement d’accès et les suggestions ; support de `updater: false` pour verrouillage de plateforme et validation stricte.',
                '**Compatibilité proxy inverse** : Résolution automatique de l’URL de base (`document.baseURI`) pour fonctionner sans accroc derrière un proxy inverse avec suppression de préfixe.'
            ],
            'teams_title': 'Équipes d’experts (Expert Teams)',
            'teams_intro': 'Gérez les équipes dans « Paramètres → Experts → Équipes d’experts », partageant l’en-tête, les filtres et la recherche. Les 5 équipes couvrent les scénarios suivants :',
            'team_col_name': 'Équipe d’experts',
            'team_col_focus': 'Focus d’analyse',
            'team_col_delivery': 'Livrables',
            'teams': [
                ('Équipe Revue de Produit', 'Valeur métier, expérience utilisateur, faisabilité technique', 'Priorités et plan d’action'),
                ('Équipe Revue Technique', 'Architecture, sécurité, critères d’acceptation', 'Risques et liste de contrôle'),
                ('Équipe Stratégie de Contenu', 'Angles éditoriaux, diffusion, vérification des faits', 'Proposition éditoriale et plan'),
                ('Équipe Diagnostic de Données', 'Métriques, qualité des données, interprétation business', 'Conclusions et étapes de validation'),
                ('Équipe Recherche Thématique', 'Périmètre d’étude, preuves, synthèse', 'Conclusions documentées et sourcées')
            ],
            'team_usage_title': 'Configuration et utilisation',
            'team_usage_steps': [
                'Utilisez une équipe intégrée ou dupliquez-la pour la modifier. Créez des équipes personnalisées de 2 à 8 membres (jusqu’à 100).',
                'Sélectionnez une équipe avec `@` dans la saisie pour insérer automatiquement des exemples de tâches modifiables.',
                'Si l’hôte active le service Agent Team, le mode de collaboration natif s’exécute automatiquement.'
            ],
            'install_title': 'Installation rapide',
            'install_cmd_web': 'dsh plugin --profile web add @michengai/dsh-agency-agents',
            'install_cmd_desktop': 'dsh plugin --profile desktop add @michengai/dsh-agency-agents',
            'divisions_title': 'Divisions d’experts (22 Divisions)',
        },
        'de': {
            'filename': 'README.de.md',
            'banner': 'assets/branding/dsh-banner-en.webp',
            'tagline': '**331 Fachexperten · 5 integrierte Teams · Benutzerdefinierte Zusammenarbeit**',
            'nav_roster': 'Expertenliste',
            'nav_install': 'Installation',
            'nav_changelog': 'Änderungsprotokoll',
            'badge_license': 'Lizenz: Apache-2.0',
            'badge_agents': 'Integrierte Agenten-331',
            'badge_downloads': 'npm Downloads',
            'badge_supported': 'DSH unterstützt bis 0.2.2--rc.1',
            'disclaimer': '> **Haftungsausschluss**: DSH Agency Agents ist ein von der Community gepflegtes Plugin für DeepSeek Harness (DSH) und kein offizielles DeepSeek AI-Produkt.',
            'features_title': 'Funktionsübersicht',
            'features_intro': 'Wählen Sie bei Code-Reviews, Design, Betrieb oder Recherchen einen passenden Experten in DSH, der Sie professionell unterstützt. 331 Experten sind integriert und sofort einsatzbereit.',
            'features': [
                '**Multi-Surface & breites Layout**: Verwaltung über **Einstellungen → Experten** oder dauerhafter Seitenleistenzugang mit zentrierter 960px-Vollansicht.',
                '**Erstellung im Dialog mit KI (Create with AI)**: Dialogbasierte Erstellung mit automatischer Weiterleitung zum Hauptchat und Prompt-Vorausfüllung. Strukturierte Vorschau und Bestätigung über native Ask-Karten (Human-in-the-Loop).',
                '**Intelligente Stapelaktionen (Batch Actions)**: Kompaktes Dropdown-Menü in der Filterleiste mit dynamischer Verknüpfung: „Gefilterte aktivieren (N) / deaktivieren (M)“ und „Alle aktivieren (331) / deaktivieren“ mit atomarer Ausführung.',
                '**Vollständiger Katalog aus 331 Domänenexperten**: 22 Standardkategorien (Entwicklung, Produkt, Design, Marketing, Recht etc.) mit sofortiger Präfixsuche.',
                '**Multidisziplinäre Teams (Teams)**: 5 leistungsstarke integrierte Review-Teams und Unterstützung für bis zu 100 benutzerdefinierte Teams in paralleler oder sequenzieller Ausführung.',
                '**Schneller Aufruf im Composer**: Experten oder Teams über das `@`-Kürzel oder die Roboter-Schaltfläche direkt mit Aufgabenbeispielen aufrufen.',
                '**Enterprise-Konfiguration & Sicherheit**: Konfigurieren Sie Zugangsorte und intelligente Empfehlungen; Unterstützung für `updater: false` zur Plattform-Sperre und Same-Origin-Schutz.',
                '**Nahtlose Reverse-Proxy-Kompatibilität**: Automatische Auflösung der Basis-URL (`document.baseURI`) für reibungslosen Betrieb hinter Pfad-Präfix-Proxies.'
            ],
            'teams_title': 'Expertenteams (Expert Teams)',
            'teams_intro': 'Verwalten Sie Teams unter „Einstellungen → Experten → Expertenteams“ mit gemeinsamen Headern, Filtern und Suchen. Die 5 Teams decken folgende Szenarien ab:',
            'team_col_name': 'Expertenteam',
            'team_col_focus': 'Analyseschwerpunkt',
            'team_col_delivery': 'Ergebnisse',
            'teams': [
                ('Produkt-Review-Team', 'Nutzen, Benutzererlebnis, technische Machbarkeit', 'Prioritäten und Maßnahmenliste'),
                ('Technisches Review-Team', 'Architektur, Sicherheit, Abnahmekriterien', 'Risiken und Checkliste'),
                ('Content-Planungs-Team', 'Themenansätze, Distributionsstrategie, Faktencheck', 'Redaktionsplan und Struktur'),
                ('Datenanalyse-Team', 'Kennzahlen, Datenqualität, geschäftliche Interpretation', 'Erkenntnisse und Validierungsschritte'),
                ('Forschungsteam', 'Untersuchungsbereich, Belege, Gesamtsynthese', 'Fundierte Forschungsergebnisse mit Quellen')
            ],
            'team_usage_title': 'Konfiguration und Nutzung',
            'team_usage_steps': [
                'Integrierte Teams direkt nutzen oder duplizieren. Eigene Teams mit 2 bis 8 Mitgliedern erstellen (bis zu 100 speicherbar).',
                'Wählen Sie ein Team mit `@` im Eingabefeld, um Aufgabenbeispiele vor dem Absenden einzufügen und anzupassen.',
                'Wenn der Host Agent Team unterstützt, wird automatisch der native parallele Kooperationsmodus verwendet.'
            ],
            'install_title': 'Schnellinstallation',
            'install_cmd_web': 'dsh plugin --profile web add @michengai/dsh-agency-agents',
            'install_cmd_desktop': 'dsh plugin --profile desktop add @michengai/dsh-agency-agents',
            'divisions_title': 'Experten-Kategorien (22 Divisions)',
        },
        'ru': {
            'filename': 'README.ru.md',
            'banner': 'assets/branding/dsh-banner-en.webp',
            'tagline': '**331 профильный агент · 5 встроенных команд · Пользовательская кооперация**',
            'nav_roster': 'Список экспертов',
            'nav_install': 'Установка',
            'nav_changelog': 'История изменений',
            'badge_license': 'Лицензия: Apache-2.0',
            'badge_agents': 'Встроенных агентов-331',
            'badge_downloads': 'Скачиваний npm',
            'badge_supported': 'Поддержка DSH до 0.2.2--rc.1',
            'disclaimer': '> **Отказ от ответственности**: DSH Agency Agents — это плагин для DeepSeek Harness (DSH), поддерживаемый сообществом, и не является официальным продуктом DeepSeek AI.',
            'features_title': 'Обзор возможностей',
            'features_intro': 'При решении задач код-ревью, дизайна, операций или исследований выберите подходящего эксперта в DSH для профессиональной помощи. Встроено 331 экспертов, готовых к работе сразу после установки.',
            'features': [
                '**Мультиповерхностный доступ и широкий макет**: Управляйте в **Настройки → Эксперты** или включите пункт в левой боковой панели для открытия в окне шириной 960px без ограничений прокрутки.',
                '**Создание в диалоге с ИИ (Create with AI)**: Создание новых экспертов и команд через диалог с автоматическим переходом в чат и предзаполнением промптов. Структурированное превью и подтверждение через карточку Ask (Human-in-the-Loop).',
                '**Умные пакетные действия (Batch Actions)**: Компактное меню в панели фильтров: «Включить отфильтрованные (N) / Отключить отфильтрованные (M)» и «Включить все (331) / Отключить все» с защитой подтверждением.',
                '**Полный каталог из 331 отраслевого эксперта**: 22 стандартных направления (разработка, продукт, дизайн, маркетинг, юриспруденция и т. д.) с мгновенным поиском по префиксу.',
                '**Многоролевая кооперация команд (Teams)**: 5 встроенных профильных команд и поддержка до 100 пользовательских команд с параллельной или последовательной работой.',
                '**Быстрый вызов в строке ввода**: Вызывайте экспертов и команды через триггер `@` или кнопку робота рядом с полем ввода с автозаполнением примеров задач.',
                '**Корпоративный контроль и безопасность**: Настройка точек входа и умных подсказок; поддержка `updater: false` для блокировки изменений на уровне платформы и защита Same-Origin.',
                '**Совместимость с обратными прокси**: Автоматическое вычисление базового адреса (`document.baseURI`) для корректной работы за прокси с удалением префиксов путей.'
            ],
            'teams_title': 'Команды экспертов (Expert Teams)',
            'teams_intro': 'Управляйте командами в меню «Настройки → Эксперты → Команды экспертов». 5 встроенных команд решают ключевые сценарии:',
            'team_col_name': 'Команда экспертов',
            'team_col_focus': 'Фокус анализа',
            'team_col_delivery': 'Результаты',
            'teams': [
                ('Команда ревью продукта', 'Ценность требований, UX, техническая реализуемость', 'Приоритеты и план действий'),
                ('Команда технического ревью', 'Архитектура, безопасность, границы приемки', 'Риски и чек-лист приемки'),
                ('Команда контент-планирования', 'Углы подачи, стратегия дистрибуции, фактчекинг', 'Контент-план и структура'),
                ('Команда анализа данных', 'Метрики, качество данных, бизнес-интерпретация', 'Выводы и шаги валидации'),
                ('Команда тематических исследований', 'Границы исследования, доказательства, синтез', 'Обоснованные выводы с источниками')
            ],
            'team_usage_title': 'Настройка и использование',
            'team_usage_steps': [
                'Используйте встроенные команды или копируйте их для кастомизации. Создавайте свои команды от 2 до 8 участников (до 100 команд).',
                'Выберите команду через `@` в поле ввода для автоматической вставки примера задачи перед отправкой.',
                'Если хост поддерживает Agent Team, автоматически задействуется нативная параллельная командная координация.'
            ],
            'install_title': 'Быстрая установка',
            'install_cmd_web': 'dsh plugin --profile web add @michengai/dsh-agency-agents',
            'install_cmd_desktop': 'dsh plugin --profile desktop add @michengai/dsh-agency-agents',
            'divisions_title': 'Категории экспертов (22 Divisions)',
        },
        'pt': {
            'filename': 'README.pt.md',
            'banner': 'assets/branding/dsh-banner-en.webp',
            'tagline': '**331 especialistas · 5 equipas integradas · Colaboração personalizada**',
            'nav_roster': 'Lista de especialistas',
            'nav_install': 'Instalação',
            'nav_changelog': 'Histórico de versões',
            'badge_license': 'Licença: Apache-2.0',
            'badge_agents': 'Agentes integrados-331',
            'badge_downloads': 'Transferências npm',
            'badge_supported': 'DSH suportado até 0.2.2--rc.1',
            'disclaimer': '> **Aviso**: O DSH Agency Agents é um plugin mantido pela comunidade para o DeepSeek Harness (DSH), não sendo um produto oficial da DeepSeek AI.',
            'features_title': 'Visão geral das funcionalidades',
            'features_intro': 'Em tarefas de revisão de código, design, operações ou pesquisa, escolha um especialista no DSH para obter suporte com rigor profissional. 331 especialistas integrados e prontos a usar após a instalação.',
            'features': [
                '**Acesso em múltiplas superfícies e layout amplo**: Faça a gestão em **Definições → Especialistas** ou ative o acesso fixo na barra lateral esquerda com painel dedicado de 960px.',
                '**Criação assistida por IA (Create with AI)**: Criação por diálogo com salto para o chat principal e preenchimento de prompts. Pré-visualizações em Markdown estruturado e confirmação nativa Ask (Human-in-the-Loop).',
                '**Ações em lote inteligentes**: Menu compacto na barra de filtros com ligação dinâmica: «Ativar filtrados (N) / Desativar filtrados (M)» e «Ativar todos (331) / Desativar todos», com execução atómica.',
                '**Catálogo completo com 331 especialistas**: Abrange 22 divisões padrão (engenharia, produto, design, marketing, jurídico, finanças, etc.) com pesquisa rápida.',
                '**Colaboração de equipas multifuncionais (Teams)**: 5 equipas integradas e suporte para até 100 equipas personalizadas com execução paralela ou em etapas.',
                '**Convocação rápida no compositor**: Convoque especialistas ou equipas através de `@` ou do botão de robô junto à caixa de entrada.',
                '**Segurança e controlo empresarial**: Configure locais de entrada e sugestões inteligentes; suporte a `updater: false` para bloqueio rigoroso da plataforma e validação de origem.',
                '**Compatibilidade com proxies inversos**: Resolução automática do endereço base (`document.baseURI`) para funcionamento perfeito atrás de proxies que removem prefixos.'
            ],
            'teams_title': 'Equipas de especialistas (Expert Teams)',
            'teams_intro': 'Faça a gestão de equipas em «Definições → Especialistas → Equipas de especialistas». As 5 equipas cobrem os seguintes cenários:',
            'team_col_name': 'Equipa de especialistas',
            'team_col_focus': 'Foco da análise',
            'team_col_delivery': 'Livrables',
            'teams': [
                ('Equipa de Revisão de Produto', 'Valor dos requisitos, experiência do utilizador, viabilidade técnica', 'Prioridades e plano de ação'),
                ('Equipa de Revisão Técnica', 'Arquitetura, segurança, critérios de aceitação', 'Riscos e lista de verificação'),
                ('Equipa de Planeamento de Conteúdos', 'Ângulo editorial, estratégia de divulgação, verificação de factos', 'Proposta editorial e estrutura'),
                ('Equipa de Diagnóstico e Análise de Dados', 'Métricas, qualidade dos dados, interpretação de negócio', 'Conclusões e passos de validação'),
                ('Equipa de Pesquisa Temática', 'Âmbito do estudo, evidências, julgamento sintético', 'Conclusões fundamentadas com fontes')
            ],
            'team_usage_title': 'Configuração e utilização',
            'team_usage_steps': [
                'Utilize uma equipa integrada diretamente ou copie-a para personalizar. Crie equipas personalizadas com 2 a 8 membros (até 100 guardadas).',
                'Selecione uma equipa com `@` na caixa de entrada para inserir automaticamente exemplos de tarefas antes de enviar.',
                'Se o anfitrião tiver o serviço Agent Team ativado, o modo nativo de colaboração paralela será aplicado automaticamente.'
            ],
            'install_title': 'Instalação rápida',
            'install_cmd_web': 'dsh plugin --profile web add @michengai/dsh-agency-agents',
            'install_cmd_desktop': 'dsh plugin --profile desktop add @michengai/dsh-agency-agents',
            'divisions_title': 'Categorias de especialistas (22 Divisions)',
        }
    }

    # 读取 22 个 division 概览
    divisions_md = """
| Division | Key | Count |
| --- | --- | --- |
| Engineering | `engineering` | 64 |
| Marketing | `marketing` | 27 |
| Design | `design` | 22 |
| Product | `product` | 21 |
| Sales | `sales` | 19 |
| Healthcare | `healthcare` | 18 |
| Finance | `finance` | 16 |
| Specialized | `specialized` | 16 |
| Academic | `academic` | 14 |
| Research | `research` | 14 |
| Legal | `legal` | 13 |
| Support | `support` | 12 |
| Testing | `testing` | 11 |
| Project Management | `project-management` | 11 |
| Game Development | `game-development` | 11 |
| Spatial Computing | `spatial-computing` | 10 |
| Company Leadership | `company` | 9 |
| Human Resources | `hr` | 8 |
| Security | `security` | 8 |
| Supply Chain | `supply-chain` | 8 |
| Paid Media | `paid-media` | 6 |
| GIS | `gis` | 3 |
"""

    for lang, c in configs.items():
        teams_rows = '\n'.join([f"| {t[0]} | {t[1]} | {t[2]} |" for t in c['teams']])
        features_list = '\n'.join([f"- {f}" for f in c['features']])
        team_steps = '\n'.join([f"{i+1}. {s}" for i, s in enumerate(c['team_usage_steps'])])

        content = f"""<div align="center">
  <img src="{c['banner']}" alt="DSH Agency Agents" width="100%">
</div>

<div align="center">

  # DSH Agency Agents

  {c['tagline']}

  [简体中文](README.zh-CN.md) · [English](README.en.md) · [日本語](README.ja.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

  [{c['nav_roster']}](#{c['divisions_title'].lower().replace(' ', '-').replace('(', '').replace(')', '')}) · [{c['nav_install']}](#{c['install_title'].lower().replace(' ', '-')}) · [{c['nav_changelog']}](CHANGELOG.md) · [Apache-2.0](LICENSE)

  [![{c['badge_license']}](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)
  [![{c['badge_agents']}](https://img.shields.io/badge/Agents-331-0f766e.svg)](#{c['divisions_title'].lower().replace(' ', '-').replace('(', '').replace(')', '')})
  [![npm package](https://img.shields.io/npm/v/%40michengai%2Fdsh-agency-agents.svg?label=npm%20package)](https://www.npmjs.com/package/@michengai/dsh-agency-agents)
  [![{c['badge_downloads']}](https://img.shields.io/npm/dt/%40michengai%2Fdsh-agency-agents.svg?label=downloads)](https://www.npmjs.com/package/@michengai/dsh-agency-agents)
  [![DSH Web Plugin](https://img.shields.io/badge/DSH%20Web-Plugin-0f766e.svg)](https://github.com/MichengAI/dsh-agency-agents)
  [![{c['badge_supported']}](https://img.shields.io/badge/DSH-0.2.2--rc.1-2563eb.svg)](https://github.com/MichengAI/dsh-agency-agents)

</div>

{c['disclaimer']}

## {c['features_title']}

{c['features_intro']}

{features_list}

## {c['teams_title']}

{c['teams_intro']}

| {c['team_col_name']} | {c['team_col_focus']} | {c['team_col_delivery']} |
| --- | --- | --- |
{teams_rows}

### {c['team_usage_title']}

{team_steps}

## {c['install_title']}

```bash
# Web Profile
{c['install_cmd_web']}

# Desktop Profile
{c['install_cmd_desktop']}
```

## {c['divisions_title']}

{divisions_md}

## License

[Apache-2.0](LICENSE) © [MichengAI](https://github.com/MichengAI)
"""
        with open(c['filename'], 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Generated {c['filename']}")

if __name__ == '__main__':
    generate_regional_readmes()
