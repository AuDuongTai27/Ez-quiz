import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Lấy đường dẫn chuẩn
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Trỏ thẳng vào thư mục chứa các folder Week1, Week2...
const RAW_DIR = path.join(__dirname, '../src/data/raw');
const OUTPUT_FILE = path.join(__dirname, '../src/data/questionBank.json');

const questionBank = [];

// 1. Quét tìm tất cả các thư mục con (Week1, Week2,...)
const folders = fs.readdirSync(RAW_DIR).filter(item => {
  return fs.statSync(path.join(RAW_DIR, item)).isDirectory();
});

// Lặp qua từng thư mục Week
folders.forEach(folder => {
  const folderPath = path.join(RAW_DIR, folder);
  
  // 2. Lặp qua từng file .txt trong thư mục Week đó
  const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.txt'));

  files.forEach(file => {
    const quizName = file.replace('.txt', ''); // Lấy tên Quiz (VD: Quiz1)
    const rawText = fs.readFileSync(path.join(folderPath, file), 'utf-8');
    
    // Tách các khối câu hỏi dựa vào khoảng trắng (dòng trống)
    const blocks = rawText.trim().split(/\n\s*\n/);

    blocks.forEach((block, index) => {
      const lines = block.split('\n').map(l => l.trim()).filter(l => l !== '');
      if (lines.length < 3) return; // Bỏ qua mẩu text thừa

      // Bóc tách câu hỏi
      const questionMatch = lines[0].match(/(\d+)\)\s+(.+)/);
      const originalId = questionMatch ? questionMatch[1] : (index + 1);
      const questionText = questionMatch ? questionMatch[2] : lines[0];

      const options = [];
      let correctAnswer = '';

      // Bóc tách đáp án
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].startsWith('Answer:')) {
          correctAnswer = lines[i].replace('Answer:', '').trim();
        } else {
          options.push(lines[i]);
        }
      }

      // 3. Đóng gói data siêu chi tiết
      questionBank.push({
        id: `${folder}_${quizName}_q${originalId}`, // VD: Week1_Quiz1_q1
        week: folder,      // Giữ lại tên folder để Frontend filter (VD: Week1)
        quiz: quizName,    // Giữ lại tên file để Frontend filter (VD: Quiz1)
        question: questionText,
        options: options,
        correctAnswer: correctAnswer
      });
    });
  });
});

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(questionBank, null, 2), 'utf-8');
console.log(`✅ Đã nhai thành công ${questionBank.length} câu hỏi từ ${folders.length} folder tuần vào questionBank.json!`);