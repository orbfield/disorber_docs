export class BinaryStream {
  constructor(key, speed = 50) {
    this.key = key;
    this.speed = speed;
    this.startTime = Date.now();
    this.fullPattern = this.generateFullPattern();
  }

  generateFullPattern() {
    const fullPatternLength = this.key * 2;
    return new Array(fullPatternLength).fill(0).map((_, i) => i < this.key ? '1' : '0');
  }

  getPattern(length) {
    // Generate a pattern that's twice as long to ensure smooth scrolling
    const pattern = this.fullPattern.join('');
    return pattern.repeat(Math.ceil(length / pattern.length) * 2);
  }

  getAnimationDuration() {
    // Calculate duration based on speed and pattern length
    // Lower speed = faster animation
    return (this.fullPattern.length * this.speed) / 100; // Convert to seconds with scaling
  }

  // Keep for compatibility with existing code
  update() {
    // No-op as animation is now handled by CSS
  }
}
