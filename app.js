'use strict';
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('is-open', open); });
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); } });
const scenarios = {
 document: { title: '문서를 읽고 옮기는 일,\n확인하고 승인하는 일로.', description: '이메일이나 문서로 들어오는 정보를 정리하고, 필요한 항목을 추출해 담당자의 검토를 돕습니다.', features: ['주문서·신청서의 주요 항목 추출', '누락 항목 및 형식 확인', '검토 완료 데이터를 기존 시스템과 연동'], before: '문서 열기 → 항목 확인 → 수기 입력 → 누락 재확인', after: '정보 추출 → 검토 목록 생성 → 담당자 승인 → 반영' },
 search: { title: '흩어진 업무 자료,\n질문에서 시작하는 검색으로.', description: '사내 매뉴얼과 업무 문서를 검색하고, 답변과 함께 원문을 확인할 수 있는 흐름을 검토합니다.', features: ['업무 매뉴얼·FAQ 등 검색 대상 정리', '문서 접근 권한을 반영한 검색 범위 설계', '출처와 원문을 확인하는 답변 화면'], before: '폴더 탐색 → 파일 열기 → 내용 검색 → 담당자에게 재문의', after: '질문 입력 → 관련 문서 검색 → 답변·출처 확인 → 업무 활용' },
 report: { title: '매번 만드는 보고서,\n취합부터 초안까지 연결.', description: '정기적으로 수집하는 데이터를 같은 기준으로 모으고, 담당자가 검토할 보고서 초안을 준비합니다.', features: ['엑셀·업무 시스템 데이터 취합', '기준에 따른 집계와 정기 보고서 초안', '원천 데이터 대조 및 담당자 검수'], before: '파일 요청 → 복사·취합 → 집계 → 보고서 작성', after: '자료 수집 → 기준별 집계 → 초안 생성 → 담당자 검수' },
 inquiry: { title: '쌓이는 고객 문의,\n분류와 전달부터 가볍게.', description: '접수된 문의를 유형별로 정리하고, 담당 부서에 전달할 요약과 답변 초안을 만드는 흐름입니다.', features: ['문의 내용 요약과 유형 분류', '담당자 전달 및 확인 상태 관리', '답변 초안 검토 후 담당자가 발송'], before: '문의 읽기 → 유형 판단 → 담당자 찾기 → 답변 작성', after: '문의 분류 → 내용 요약 → 담당자 검토 → 답변 발송' }
};
const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectScenario(tab) {
 const scenario = scenarios[tab.dataset.solution];
 tabs.forEach(item => { const selected = item === tab; item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1; });
 document.querySelector('#solution-panel').setAttribute('aria-labelledby', tab.id);
 const title = document.querySelector('#solution-title'); title.replaceChildren();
 scenario.title.split('\n').forEach((line,index) => { if(index) title.append(document.createElement('br')); title.append(document.createTextNode(line)); });
 document.querySelector('#solution-description').textContent = scenario.description;
 document.querySelector('#solution-features').replaceChildren(...scenario.features.map(text => { const item = document.createElement('li'); item.textContent = text; return item; }));
 document.querySelector('#solution-before').textContent = scenario.before;
 document.querySelector('#solution-after').textContent = scenario.after;
}
tabs.forEach((tab, index) => {
 tab.addEventListener('click', () => selectScenario(tab));
 tab.addEventListener('keydown', event => {
  const indices = { ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1 };
  if (Object.hasOwn(indices, event.key)) { event.preventDefault(); const next = tabs[indices[event.key]]; selectScenario(next); next.focus(); }
 });
});
document.querySelector('#inquiry-form').addEventListener('submit', event => {
 event.preventDefault();
 const form = event.currentTarget;
 const company = form.elements.company.value.trim();
 const task = form.elements.task.value.trim();
 const status = document.querySelector('#form-status');
 if (!company || !task) { status.textContent = '회사 / 담당자와 개선하고 싶은 업무를 입력해주세요.'; (!company ? form.elements.company : form.elements.task).focus(); return; }
 const tools = form.elements.tools.value.trim();
 const subject = `[AX 도입 상담] ${company}`;
 const body = `회사 / 담당자: ${company}\n\n개선하고 싶은 업무:\n${task}\n\n현재 사용하는 도구: ${tools || '상담 시 공유'}\n\n홈페이지를 통해 AX 도입 상담을 문의합니다.`;
 const mailto = `mailto:kr.devking@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
 window.location.href = mailto;
 status.replaceChildren(document.createTextNode('메일 앱에서 내용을 확인한 뒤 전송해주세요. 열리지 않으면 '));
 const retry = document.createElement('a'); retry.href = mailto; retry.textContent = '메일 앱 다시 열기'; retry.style.textDecoration = 'underline'; status.append(retry, document.createTextNode(' 또는 위 이메일 주소로 직접 문의해주세요.'));
});
